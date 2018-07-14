import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { AuthService } from '@services/auth.service';
import { CommentService } from '../shared/comment.service';
import { CurrentStateService } from '@services/current-state.service';
import { environment } from '@env';
import { NotificationsService } from 'angular2-notifications';
import { News } from '@models/news.model';
import { NewsService } from '../shared/news.service';
import { TitleService } from '@services/title.service';
import { User } from '@models/user.model';

@Component({
    selector: 'app-news-datail',
    templateUrl: './news-detail.component.html',
    styleUrls: ['./news-detail.component.scss']
})
export class NewsDetailComponent implements OnInit, OnDestroy {
    constructor(
        private activatedRoute: ActivatedRoute,
        private authService: AuthService,
        private commentService: CommentService,
        private currentStateService: CurrentStateService,
        private domSanitizer: DomSanitizer,
        private formBuilder: FormBuilder,
        private location: Location,
        private notificationService: NotificationsService,
        private newsService: NewsService,
        private titleService: TitleService
    ) {}

    addCommentForm: FormGroup;
    authenticatedUser: User = this.currentStateService.user;
    errorNews: string | Array<string>;
    news: News;
    newsImagesUrl: string = environment.apiImageNews;
    spinnerButton = false;
    userImageDefault: string = environment.imageUserDefault;
    userImagesUrl: string = environment.apiImageUsers;
    userSubscription: Subscription;

    assembleHTMLItem(message: string) {
        return this.domSanitizer.bypassSecurityTrustHtml(message);
    }

    goBack() {
        this.location.back();
    }

    ngOnDestroy() {
        if (!this.userSubscription.closed) {
            this.userSubscription.unsubscribe();
        }
    }

    ngOnInit() {
        this.addCommentForm = this.formBuilder.group({
            user_id: ['', [Validators.required]],
            news_id: ['', [Validators.required]],
            body: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]]
        });
        this.userSubscription = this.authService.getUser.subscribe(response => {
            this.authenticatedUser = response;
            this.addCommentForm.patchValue({ user_id: response ? response.id : '' });
        });
        this.activatedRoute.params.forEach((params: Params) => {
            this.newsService.getNewsItem(+params['id']).subscribe(
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
        });
    }

    onSubmit(value, valid) {
        this.spinnerButton = true;
        this.commentService.createComment(value).subscribe(
            () => {
                this.newsService.getNewsItem(value.news_id).subscribe(
                    response => {
                        this.news = response;
                    },
                    error => {
                        this.errorNews = error;
                    }
                );
                this.notificationService.success('Успішно', 'Новий коментар додано');
                this.addCommentForm.reset({ news_id: this.news.id, user_id: this.authenticatedUser.id });
                this.spinnerButton = false;
            },
            errors => {
                for (const error of errors) {
                    this.notificationService.error('Помилка', error);
                }
                this.spinnerButton = false;
            }
        );
    }
}
