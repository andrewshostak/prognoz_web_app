import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { News } from '@models/news.model';
import { NewsService } from '../../../news/shared/news.service';
import { NotificationsService } from 'angular2-notifications';

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
        private notificationsService: NotificationsService
    ) {}

    confirmModalMessage: string;
    confirmModalReference: NgbModalRef;
    currentPage: number;
    errorNews: string | Array<string>;
    news: News[];
    lastPage: number;
    path = '/manage/news/page/';
    perPage: number;
    selectedNews: News;
    total: number;

    deleteNewsItem(news: News) {
        this.newsService.deleteNewsItem(news.id).subscribe(
            () => {
                this.confirmModalReference.close();
                this.total--;
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
            this.newsService.getNews(params['number']).subscribe(
                response => {
                    if (response) {
                        this.currentPage = response.current_page;
                        this.lastPage = response.last_page;
                        this.perPage = response.per_page;
                        this.total = response.total;
                        this.news = response.data;
                    }
                },
                error => {
                    this.errorNews = error;
                }
            );
        });
    }

    openConfirmModal(content: NgbModalRef, news: News): void {
        this.confirmModalMessage = `Видалити ${news.title}?`;
        this.selectedNews = news;
        this.confirmModalReference = this.ngbModalService.open(content);
        this.confirmModalReference.result.then(() => (this.selectedNews = null), () => (this.selectedNews = null));
    }
}
