import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import { CurrentStateService } from '@services/current-state.service';
import { environment } from '@env';
import { NotificationsService } from 'angular2-notifications';
import { News } from '@models/news.model';
import { NewsService } from '../shared/news.service';
import { TitleService } from '@services/title.service';
import { CommentNew } from '@models/new/comment-new.model';
import { CommentNewService } from '@app/news/shared/comment-new.service';
import { CommentSearch } from '@models/search/comment-search.model';
import { SettingsService } from '@services/settings.service';
import { UserNew } from '@models/new/user-new.model';
import { Sequence } from '@enums/sequence.enum';

@Component({
   selector: 'app-news-detail',
   templateUrl: './news-detail.component.html'
})
export class NewsDetailComponent implements OnInit {
   constructor(
      private activatedRoute: ActivatedRoute,
      private commentService: CommentNewService,
      private currentStateService: CurrentStateService,
      private domSanitizer: DomSanitizer,
      private location: Location,
      private notificationsService: NotificationsService,
      private newsService: NewsService,
      private titleService: TitleService
   ) {}

   public authenticatedUser: UserNew;
   public comments: CommentNew[];
   public news: News;
   public newsId: number;
   public newsImagesUrl = environment.apiImageNews;
   public spinnerButton = false;

   public assembleHTMLItem(message: string): SafeHtml {
      return this.domSanitizer.bypassSecurityTrustHtml(message);
   }

   public getCommentsData(newsId: number): void {
      const search = {
         orderBy: 'created_at',
         sequence: Sequence.Ascending,
         limit: SettingsService.maxLimitValues.comments,
         page: 1,
         relations: ['user.clubs', 'user.winners.award', 'user.winners.competition', 'updater', 'deleter'],
         newsId
      } as CommentSearch;
      this.commentService.getComments(search).subscribe(response => (this.comments = response.data));
   }

   public ngOnInit(): void {
      this.newsId = +this.activatedRoute.snapshot.params.id;
      this.getCommentsData(this.newsId);
      this.getNewsData(this.newsId);
   }

   private getNewsData(newsId: number): void {
      this.newsService.getNewsItem(newsId).subscribe(response => {
         if (response) {
            this.news = response;
            this.titleService.setTitle(this.news.title);
         }
      });
   }

   public commentCreated(comment: CommentNew): void {
      this.comments = [...this.comments, comment];
   }
}
