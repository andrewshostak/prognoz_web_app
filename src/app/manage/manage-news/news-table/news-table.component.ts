import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { NotificationsService } from 'angular2-notifications';
import { News } from '@models/news.model';
import { NewsService } from '../../../news/shared/news.service';

declare var $: any;

@Component({
    selector: 'app-news-table',
    templateUrl: './news-table.component.html',
    styleUrls: ['./news-table.component.scss']
})
export class NewsTableComponent implements OnInit {
    constructor(
        private activatedRoute: ActivatedRoute,
        private notificationsService: NotificationsService,
        private newsService: NewsService
    ) {}

    confirmModalData: any;
    confirmModalId: string;
    confirmModalMessage: string;
    confirmSpinnerButton: boolean;
    currentPage: number;
    errorNews: string | Array<string>;
    news: News[];
    lastPage: number;
    path = '/manage/news/page/';
    perPage: number;
    total: number;

    confirmModalSubmit(data: any) {
        switch (this.confirmModalId) {
            case 'deleteNewsConfirmModal':
                this.deleteNewsItem(data);
                break;
        }
    }

    deleteNewsItem(news: News) {
        this.confirmSpinnerButton = true;
        this.newsService.deleteNewsItem(news.id).subscribe(
            response => {
                this.total--;
                this.news = this.news.filter(n => n !== news);
                this.notificationsService.success('Успішно', news.title + ' видалено');
                this.confirmSpinnerButton = false;
                $('#' + this.confirmModalId).modal('hide');
            },
            errors => {
                for (const error of errors) {
                    this.notificationsService.error('Помилка', error);
                }
                this.confirmSpinnerButton = false;
                $('#' + this.confirmModalId).modal('hide');
            }
        );
    }

    deleteNewsConfirmModalOpen(news: News) {
        this.confirmModalMessage = 'Ви справді хочете видалити цю новину?';
        this.confirmModalId = 'deleteNewsConfirmModal';
        this.confirmModalData = news;
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
}
