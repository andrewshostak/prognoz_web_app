import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NotificationsService } from 'angular2-notifications';
import { NewsNewService } from '@services/new/news-new.service';
import { NewsNew } from '@models/v2/news-new.model';
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
      this.newsNewService.deleteNews(news.id).subscribe(
         () => {
            this.confirmModalReference.close();
            this.news = this.news.filter(n => n.id !== news.id);
            this.notificationsService.success('Успішно', news.title + ' видалено');
         },
         () => this.confirmModalReference.close()
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
