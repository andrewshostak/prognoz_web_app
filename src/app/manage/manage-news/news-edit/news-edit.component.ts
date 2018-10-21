import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { News } from '@models/news.model';
import { NewsService } from '../../../news/shared/news.service';

@Component({
    selector: 'app-news-edit',
    templateUrl: './news-edit.component.html',
    styleUrls: ['./news-edit.component.scss']
})
export class NewsEditComponent implements OnInit {
    constructor(private activatedRoute: ActivatedRoute, private newsService: NewsService) {}

    news: News;
    errorNews: string | Array<string>;

    ngOnInit() {
        this.activatedRoute.params.forEach((params: Params) => {
            this.getNewsItemData(params['id']);
        });
    }

    private getNewsItemData(newsId: number): void {
        this.newsService.getNewsItem(newsId).subscribe(
            response => {
                if (response) {
                    this.news = response;
                }
            },
            error => {
                this.errorNews = error;
            }
        );
    }
}
