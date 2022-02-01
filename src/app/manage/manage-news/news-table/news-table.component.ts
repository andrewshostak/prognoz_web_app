import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NewsService } from '@app/news/shared/news.service';
import { NotificationsService } from 'angular2-notifications';
import { NewsNewService } from '@services/new/news-new.service';
import { NewsNew } from '@models/new/news-new.model';
import { NewsSearch } from '@models/search/news-search.model';
import { SettingsService } from '@services/settings.service';
import { Sequence } from '@enums/sequence.enum';
import { PaginationService } from '@services/pagination.service';
import { Pagination } from '@models/pagination.model';

@Component({
   selector: 'app-news-table',
   templateUrl: './news-table.component.html',
   styleUrls: ['./news-table.component.scss']
})
export class NewsTableComponent implements OnInit {
   constructor(
      private activatedRoute: ActivatedRoute,
      private ngbModalService: NgbModal,
      private newsService: NewsService,
      private newsNewService: NewsNewService,
      private notificationsService: NotificationsService
   ) {}

   confirmModalMessage: string;
   confirmModalReference: NgbModalRef;
   news: NewsNew[];
   path = '/manage/news/page/';
   selectedNews: NewsNew;
   paginationData: Pagination;

   deleteNewsItem(news: NewsNew) {
      this.newsService.deleteNewsItem(news.id).subscribe(
         () => {
            this.confirmModalReference.close();
            this.news = this.news.filter(n => n.id !== news.id);
            this.notificationsService.success('Успішно', news.title + ' видалено');
         },
         errors => {
            this.confirmModalReference.close();
            for (const error of errors) {
               this.notificationsService.error('Помилка', error);
            }
         }
      );
   }

   ngOnInit() {
      this.activatedRoute.params.subscribe((params: Params) => {
         const search: NewsSearch = {
            page: params.number,
            relations: ['tournament'],
            limit: SettingsService.newsPerPage,
            orderBy: 'created_at',
            sequence: Sequence.Descending
         };
         this.newsNewService.getNews(search).subscribe(response => {
            this.news = response.data;
            this.paginationData = PaginationService.getPaginationData(response, this.path);
         });
      });
   }

   openConfirmModal(content: NgbModalRef, news: NewsNew): void {
      this.confirmModalMessage = `Видалити ${news.title}?`;
      this.selectedNews = news;
      this.confirmModalReference = this.ngbModalService.open(content);
      this.confirmModalReference.result.then(
         () => (this.selectedNews = null),
         () => (this.selectedNews = null)
      );
   }
}
