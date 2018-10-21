import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { environment } from '@env';
import { ImageService } from '@services/image.service';
import { News } from '@models/news.model';
import { NewsService } from '../../../../news/shared/news.service';
import { NotificationsService } from 'angular2-notifications';
import { QuillEditorComponent } from 'ngx-quill';
import { UtilsService } from '@services/utils.service';

@Component({
    selector: 'app-news-form',
    templateUrl: './news-form.component.html',
    styleUrls: ['./news-form.component.scss']
})
export class NewsFormComponent implements OnChanges, OnInit {
    constructor(
        private imageService: ImageService,
        private newsService: NewsService,
        private notificationsService: NotificationsService,
        private router: Router
    ) {
        imageService.uploadedImage$.subscribe(response => {
            this.newsForm.patchValue({ image: response });
            this.errorImage = null;
        });
        imageService.uploadError$.subscribe(response => {
            this.errorImage = response;
        });
    }

    @Input() news: News;
    @ViewChild('editor') editor: QuillEditorComponent;

    errorImage: string;
    editorModules = {};
    newsForm: FormGroup;
    newsImagesUrl = environment.apiImageNews;
    spinnerButton = false;

    fileChange(event) {
        this.imageService.fileChange(event, environment.imageSettings.news);
    }

    ngOnChanges(simpleChanges: SimpleChanges) {
        UtilsService.patchSimpleChangeValuesInForm(simpleChanges, this.newsForm, 'news', (formGroup, field, value) => {
            if (field !== 'image' && formGroup.get(field)) {
                formGroup.patchValue({ [field]: value });
            } else if (field === 'image') {
                this.newsForm.get('image').setValidators([]);
                this.newsForm.get('image').updateValueAndValidity();
            }
        });
    }

    ngOnInit() {
        this.newsForm = new FormGroup({
            title: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(100)]),
            body: new FormControl('', [Validators.required, Validators.minLength(50)]),
            tournament_id: new FormControl(null),
            image: new FormControl('', [Validators.required])
        });

        this.editorModules = {
            toolbar: [
                ['bold', 'italic', 'underline', 'strike'],
                [{ header: 1 }, { header: 2 }],
                [{ list: 'ordered' }, { list: 'bullet' }],
                [{ header: [1, 2, 3, 4, 5, 6, false] }],
                [{ align: [] }],
                ['clean']
            ]
        };
    }

    onSubmit(): void {
        if (this.newsForm.valid) {
            this.news ? this.updateNews(this.newsForm.value) : this.createNews(this.newsForm.value);
        }
    }

    private updateNews(news: News): void {
        this.spinnerButton = true;
        this.newsService.updateNewsItem(news, this.news.id).subscribe(
            () => {
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

    private createNews(news: News): void {
        this.spinnerButton = true;
        this.newsService.createNewsItem(news).subscribe(
            response => {
                this.notificationsService.success('Успішно', 'Новину створено!');
                this.spinnerButton = false;
                this.router.navigate(['/manage', 'news', response.id, 'edit']);
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
