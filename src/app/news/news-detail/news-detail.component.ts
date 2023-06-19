import { Location } from '@angular/common';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import { CurrentStateService } from '@services/current-state.service';
import { NotificationsService } from 'angular2-notifications';
import { TitleService } from '@services/title.service';
import { Comment } from '@models/v2/comment.model';
import { CommentService } from '@app/news/shared/comment.service';
import { CommentSearch } from '@models/search/comment-search.model';
import { SettingsService } from '@services/settings.service';
import { User } from '@models/v2/user.model';
import { OpenedModal } from '@models/opened-modal.model';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Sequence } from '@enums/sequence.enum';
import { ModelStatus } from '@enums/model-status.enum';
import { AuthService } from '@services/v2/auth.service';
import * as moment from 'moment';
import { NewsService } from '@services/v2/news.service';
import { News } from '@models/v2/news.model';

@Component({
   selector: 'app-news-detail',
   templateUrl: './news-detail.component.html'
})
export class NewsDetailComponent implements OnInit {
   constructor(
      private activatedRoute: ActivatedRoute,
      private authService: AuthService,
      private commentService: CommentService,
      private currentStateService: CurrentStateService,
      private domSanitizer: DomSanitizer,
      private location: Location,
      private ngbModalService: NgbModal,
      private notificationsService: NotificationsService,
      private newsService: NewsService,
      private titleService: TitleService
   ) {}

   public authenticatedUser: User;
   public comments: Comment[];
   public news: News;
   public newsId: number;
   public newsImagesUrl = SettingsService.newsLogosPath;
   public openedModal: OpenedModal<number>;
   public spinnerButton = false;

   public assembleHTMLItem(message: string): SafeHtml {
      return this.domSanitizer.bypassSecurityTrustHtml(message);
   }

   public deleteComment(): void {
      this.commentService.deleteComment(this.openedModal.data).subscribe(() => {
         this.openedModal.reference.close();
         this.notificationsService.success('Успішно', 'Коментар видалено');
         const index = this.comments.findIndex(comment => comment.id === this.openedModal.data);
         if (index > -1) {
            this.comments[index] = {
               ...this.comments[index],
               body: null,
               deleted_by: this.authenticatedUser.id,
               deleter: this.authenticatedUser,
               deleted_at: moment().format('YYYY-MM-DD HH:mm:ss')
            };
         }
      });
   }

   public getCommentsData(newsId: number): void {
      const search = {
         orderBy: 'created_at',
         sequence: Sequence.Ascending,
         limit: SettingsService.maxLimitValues.comments,
         page: 1,
         relations: ['user.clubs', 'user.winners.award', 'user.winners.competition.season', 'deleter'],
         newsId,
         trashed: ModelStatus.Truthy
      } as CommentSearch;
      this.commentService.getComments(search).subscribe(response => (this.comments = response.data));
   }

   public ngOnInit(): void {
      this.newsId = +this.activatedRoute.snapshot.params.id;
      this.getCommentsData(this.newsId);
      this.getNewsData(this.newsId);
      this.authenticatedUser = this.authService.getUser();
   }

   public openConfirmModal(data: number, content: NgbModalRef | TemplateRef<any>, submitted: (event) => void): void {
      const reference = this.ngbModalService.open(content, { centered: true });
      this.openedModal = { reference, data, submitted: () => submitted.call(this) };
   }

   private getNewsData(newsId: number): void {
      this.newsService.getNewsItem(newsId, ['author']).subscribe(response => {
         this.news = response;
         this.titleService.setTitle(this.news.title);
      });
   }

   public commentCreated(comment: Comment): void {
      comment.is_changeable = true;
      this.comments = [...this.comments, comment];
   }

   public updateComment(comment: Comment): void {
      this.commentService.updateComment(comment.id, comment).subscribe(response => {
         this.notificationsService.success('Успішно', 'Коментар змінено');
         const index = this.comments.findIndex(c => c.id === comment.id);
         if (index > -1) {
            this.comments[index] = response;
         }
      });
   }
}
