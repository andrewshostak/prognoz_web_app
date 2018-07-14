import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { environment } from '@env';
import { ImageService } from '@services/image.service';
import { NotificationsService } from 'angular2-notifications';
import { NewsService } from '../../../news/shared/news.service';

@Component({
    selector: 'app-news-create',
    templateUrl: './news-create.component.html',
    styleUrls: ['./news-create.component.scss']
})
export class NewsCreateComponent implements OnInit {
    constructor(
        private imageService: ImageService,
        private notificationsService: NotificationsService,
        private newsService: NewsService,
        private router: Router
    ) {
        imageService.uploadedImage$.subscribe(response => {
            this.newsCreateForm.patchValue({ image: response });
            this.errorImage = null;
        });
        imageService.uploadError$.subscribe(response => {
            this.errorImage = response;
        });
    }

    errorImage: string;
    newsCreateForm: FormGroup;
    spinnerButton = false;

    fileChange(event) {
        this.imageService.fileChange(event, environment.imageSettings.news);
    }

    ngOnInit() {
        this.newsCreateForm = new FormGroup({
            title: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(100)]),
            body: new FormControl('', [Validators.required, Validators.minLength(50), Validators.maxLength(3000)]),
            image: new FormControl(),
            tournament_id: new FormControl('', [Validators.required])
        });
    }

    onSubmit() {
        this.spinnerButton = true;
        this.newsService.createNewsItem(this.newsCreateForm.value).subscribe(
            response => {
                this.router.navigate(['/news/' + response.id]);
                this.notificationsService.success('Успішно', 'Новину створено!');
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
