import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ClubService } from '@services/club.service';
import { environment } from '@env';
import { ImageService } from '@services/image.service';
import { NotificationsService } from 'angular2-notifications';

@Component({
   selector: 'app-club-create',
   templateUrl: './club-create.component.html',
   styleUrls: ['./club-create.component.scss']
})
export class ClubCreateComponent implements OnInit {
   constructor(
      private clubService: ClubService,
      private imageService: ImageService,
      private notificationsService: NotificationsService,
      private router: Router
   ) {
      imageService.uploadedImage$.subscribe(response => {
         this.clubCreateForm.patchValue({ image: response });
         this.errorImage = null;
      });
      imageService.uploadError$.subscribe(response => {
         this.errorImage = response;
      });
   }

   clubCreateForm: FormGroup;
   errorImage: string;
   spinnerButton = false;

   fileChange(event) {
      this.imageService.fileChange(event, environment.imageSettings.club);
   }

   ngOnInit() {
      this.clubCreateForm = new FormGroup({
         title: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
         link: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
         image: new FormControl('', [Validators.required]),
         parent_id: new FormControl(null)
      });
   }

   onSubmit() {
      this.spinnerButton = true;
      if (this.clubCreateForm.value.parent_id === 'country') {
         this.clubCreateForm.value.parent_id = null;
      }
      this.clubService.createClub(this.clubCreateForm.value).subscribe(
         response => {
            this.router.navigate(['/manage/clubs']);
            this.notificationsService.success('Успішно', 'Команду ' + response.title + ' створено!');
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
