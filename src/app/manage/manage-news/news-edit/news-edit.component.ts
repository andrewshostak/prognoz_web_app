import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, Params } from '@angular/router';

import { environment } from '@env';
import { ImageService } from '@services/image.service';
import { NotificationsService } from 'angular2-notifications';
import { News } from '@models/news.model';
import { NewsService } from '../../../news/shared/news.service';

@Component({
    selector: 'app-news-edit',
    templateUrl: './news-edit.component.html',
    styleUrls: ['./news-edit.component.scss']
})
export class NewsEditComponent implements OnInit {
    constructor(
        private activatedRoute: ActivatedRoute,
        private formBuilder: FormBuilder,
        private imageService: ImageService,
        private notificationsService: NotificationsService,
        private newsService: NewsService,
        private router: Router
    ) {
        imageService.uploadedImage$.subscribe(response => {
            this.newsEditForm.patchValue({ image: response });
            this.errorImage = null;
        });
        imageService.uploadError$.subscribe(response => {
            this.errorImage = response;
        });
    }

    errorImage: string;
    errorNews: string | Array<string>;
    news: News;
    newsEditForm: FormGroup;
    newsImagesUrl = environment.apiImageNews;
    spinnerButton = false;

    fileChange(event) {
        this.imageService.fileChange(event, environment.imageSettings.news);
    }

    ngOnInit() {
        this.newsEditForm = this.formBuilder.group({
            id: ['', [Validators.required]],
            title: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(100)]],
            body: ['', [Validators.required, Validators.minLength(50), Validators.maxLength(3000)]],
            tournament_id: ['', [Validators.required]],
            image: ['']
        });

        this.activatedRoute.params.forEach((params: Params) => {
            this.newsService.getNewsItem(+params['id']).subscribe(
                response => {
                    if (response) {
                        this.news = response;
                        this.newsEditForm.patchValue({
                            id: this.news.id,
                            title: this.news.title,
                            body: this.news.body,
                            tournament_id: this.news.tournament_id
                        });
                    }
                },
                error => {
                    this.errorNews = error;
                }
            );
        });
    }

    onSubmit() {
        this.spinnerButton = true;
        this.newsService.updateNewsItem(this.newsEditForm.value).subscribe(
            response => {
                this.router.navigate(['/news/' + this.news.id]);
                this.notificationsService.success('Успішно', 'Новину змінено!');
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
