import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { UtilsService } from '@services/utils.service';
import { NotificationsService } from 'angular2-notifications';
import { QuillEditorComponent } from 'ngx-quill';
import { NewsService } from '@services/v2/news.service';
import { News } from '@models/v2/news.model';
import { FormValidatorService } from '@services/form-validator.service';

@Component({
   selector: 'app-news-form',
   templateUrl: './news-form.component.html',
   styleUrls: ['./news-form.component.scss']
})
export class NewsFormComponent implements OnChanges, OnInit {
   @Input() public news: News;
   @ViewChild('editor') public editor: QuillEditorComponent;

   public editorModules = {};
   public newsForm: FormGroup;
   public newsImageExtensions: string[];
   public newsImageSize: number;
   public spinnerButton = false;

   constructor(
      private formValidatorService: FormValidatorService,
      private newsService: NewsService,
      private notificationsService: NotificationsService,
      private router: Router
   ) {}

   public ngOnChanges(simpleChanges: SimpleChanges) {
      UtilsService.patchSimpleChangeValuesInForm(simpleChanges, this.newsForm, 'news', this.patchNewsValuesInForm);
      if (!simpleChanges.news.isFirstChange()) {
         this.newsForm.removeControl('image');
         this.newsForm.addControl(
            'image',
            new FormControl(null, [
               this.formValidatorService.fileType(this.newsImageExtensions),
               this.formValidatorService.fileSize(this.newsImageSize)
            ])
         );
      }
   }

   public ngOnInit() {
      this.newsImageExtensions = FormValidatorService.fileExtensions.newsImage;
      this.newsImageSize = FormValidatorService.fileSizeLimits.newsImage;

      this.newsForm = new FormGroup({
         title: new FormControl(null, [Validators.required, Validators.minLength(10), Validators.maxLength(100)]),
         body: new FormControl(null, [Validators.required, Validators.minLength(50)]),
         tournament_id: new FormControl(null),
         image: new FormControl(null, [
            Validators.required,
            this.formValidatorService.fileType(this.newsImageExtensions),
            this.formValidatorService.fileSize(this.newsImageSize)
         ])
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

   public onSubmit(): void {
      if (this.newsForm.invalid) {
         return;
      }

      this.news ? this.updateNews(this.newsForm.value) : this.createNews(this.newsForm.value);
   }

   public showFormErrorMessage(abstractControl: AbstractControl, errorKey: string): boolean {
      return UtilsService.showFormErrorMessage(abstractControl, errorKey);
   }

   public showFormInvalidClass(abstractControl: AbstractControl): boolean {
      return UtilsService.showFormInvalidClass(abstractControl);
   }

   private updateNews(news: Partial<News>): void {
      this.spinnerButton = true;
      this.newsService.updateNews(this.news.id, news).subscribe(
         response => {
            this.spinnerButton = false;
            this.notificationsService.success('Успішно', 'Новину змінено!');
            this.news = response;
         },
         () => (this.spinnerButton = false)
      );
   }

   private createNews(news: Partial<News>): void {
      this.spinnerButton = true;
      this.newsService.createNews(news).subscribe(
         response => {
            this.spinnerButton = false;
            this.notificationsService.success('Успішно', 'Новину створено');
            this.router.navigate(['/manage', 'news', response.id, 'edit']);
         },
         () => (this.spinnerButton = false)
      );
   }

   private patchNewsValuesInForm(formGroup, field, value) {
      switch (field) {
         case 'image':
            return formGroup.get('image').setValue(null);
         default:
            return formGroup.get(field) && formGroup.patchValue({ [field]: value });
      }
   }
}
