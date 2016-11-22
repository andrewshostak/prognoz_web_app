import { Component, OnInit }              from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NotificationsService }           from 'angular2-notifications';

import { ManageNewsService }              from '../shared/manage-news.service';

@Component({
  selector: 'app-news-table',
  templateUrl: './news-table.component.html',
  styleUrls: ['./news-table.component.css']
})
export class NewsTableComponent implements OnInit {

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private manageNewsService: ManageNewsService,
        private notificationService: NotificationsService
    ) { }

    news: Array<any>;
    error: string | Array<string>;

    /**
     * Variables for pagination work
     */
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;

    /**
     * Variables for confirmation modal
     */
    title: string = 'Підтвердження';
    message: string = 'Ви дійсно бажаєте видалити';
    confirmClicked: boolean = false;
    cancelClicked: boolean = false;


    /**
     * Get page id from url if exists
     * Send request to get news
     * If there is no news in DB or error happened
     * Show error message
     */
    ngOnInit() {
        this.activatedRoute.params.subscribe((params: Params) => {
            this.manageNewsService.getNews(params['number']).subscribe(
                result => {
                    if (!result.data) {
                        this.error = "В базі даних новин немає";
                    } else {
                        this.currentPage = result.current_page;
                        this.lastPage = result.last_page;
                        this.perPage = result.per_page;
                        this.total = result.total;
                        this.news = result.data;
                    }
                },
                error => this.error = error
            )
        });
    }

    /**
     * Navigation from pagination
     *
     * @param event
     */
    pageChanged(event) {
        this.router.navigate(['/manage/news/page', event]);
    }

    /**
     * Delete one news
     *
     * @param news
     */
    delete(news) {
        this.manageNewsService.delete(news.id).subscribe(
            response => {
                this.news = this.news.filter(n => n !== news);
                this.notificationService.success('Успішно', news.title + ' видалено');
            },
            errors => {
                for (let error of errors) {
                    this.notificationService.error('Помилка', error);
                }
            }
        );
    }
}
