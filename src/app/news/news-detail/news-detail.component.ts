import { Location } from '@angular/common';
import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Params } from '@angular/router';

import { Comment } from '@models/comment.model';
import { CommentService } from '../shared/comment.service';
import { CurrentStateService } from '@services/current-state.service';
import { environment } from '@env';
import { NotificationsService } from 'angular2-notifications';
import { News } from '@models/news.model';
import { NewsService } from '../shared/news.service';
import { RequestParams } from '@models/request-params.model';
import { TitleService } from '@services/title.service';
import { User } from '@models/user.model';

@Component({
    selector: 'app-news-detail',
    templateUrl: './news-detail.component.html',
    styleUrls: ['./news-detail.component.scss']
})
export class NewsDetailComponent implements OnInit {
    constructor(
        private activatedRoute: ActivatedRoute,
        private commentService: CommentService,
        private currentStateService: CurrentStateService,
        private domSanitizer: DomSanitizer,
        private elementRef: ElementRef,
        private formBuilder: FormBuilder,
        private location: Location,
        private notificationsService: NotificationsService,
        private newsService: NewsService,
        private titleService: TitleService
    ) {}

    addCommentForm: FormGroup;
    authenticatedUser: User;
    comments: Comment[];
    errorComments: string;
    errorNews: string;
    news: News;
    newsImagesUrl: string = environment.apiImageNews;
    spinnerButton = false;
    userImageDefault: string = environment.imageUserDefault;
    userImagesUrl: string = environment.apiImageUsers;

    assembleHTMLItem(message: string) {
        return this.domSanitizer.bypassSecurityTrustHtml(message);
    }

    getComments(newsId: number): void {
        const params: RequestParams[] = [
            { parameter: 'news_id', value: newsId.toString() },
            { parameter: 'order_by', value: 'created_at' },
            { parameter: 'sequence', value: 'asc' }
        ];
        this.commentService.getComments(params).subscribe(
            response => {
                this.comments = response;
            },
            error => {
                this.errorComments = error;
            }
        );
    }

    ngOnInit() {
        this.addCommentForm = this.formBuilder.group({
            user_id: ['', [Validators.required]],
            news_id: ['', [Validators.required]],
            body: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]]
        });
        this.authenticatedUser = this.currentStateService.getUser();
        this.addCommentForm.patchValue({ user_id: this.currentStateService.getUser() ? this.currentStateService.getUser().id : '' });
        this.activatedRoute.params.forEach((params: Params) => {
            this.getNewsData(+params['id']);
            this.getComments(+params['id']);
        });
    }

    onSubmit(): void {
        if (this.addCommentForm.valid) {
            this.spinnerButton = true;
            this.commentService.createComment(this.addCommentForm.value).subscribe(
                response => {
                    if (!this.comments) {
                        this.comments = [];
                    }
                    this.comments.push(response);
                    this.notificationsService.success('Успішно', 'Новий коментар додано');
                    this.addCommentForm.reset({ news_id: this.news.id, user_id: this.authenticatedUser.id });
                    this.spinnerButton = false;
                },
                errors => {
                    for (const error of errors) {
                        this.notificationsService.error('Помилка', error);
                    }
                    this.spinnerButton = false;
                }
            );
        }
    }

    scrollTo(id: string): void {
        const element = this.elementRef.nativeElement.querySelector(id);
        if (element) {
            element.scrollIntoView();
        }
    }

    private getNewsData(newsId: number): void {
        this.newsService.getNewsItem(newsId).subscribe(
            response => {
                if (response) {
                    this.news = response;
                    this.titleService.setTitle(this.news.title);
                    const userId = this.authenticatedUser ? this.authenticatedUser.id.toString() : '';
                    this.addCommentForm.patchValue({ news_id: this.news.id, user_id: userId });
                }
            },
            error => {
                this.errorNews = error;
            }
        );
    }
}
