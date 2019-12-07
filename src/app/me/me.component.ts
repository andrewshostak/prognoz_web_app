import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { environment } from '@env';
import { ClubNew } from '@models/new/club-new.model';
import { UserNew } from '@models/new/user-new.model';
import { ClubService } from '@services/club.service';
import { ImageService } from '@services/image.service';
import { AuthNewService } from '@services/new/auth-new.service';
import { TitleService } from '@services/title.service';
import { UserService } from '@services/user.service';
import { NotificationsService } from 'angular2-notifications';
import { assign } from 'lodash';

@Component({
   selector: 'app-me',
   templateUrl: './me.component.html',
   styleUrls: ['./me.component.scss']
})
export class MeComponent implements OnInit {
   public authenticatedUser: UserNew;
   public clubs: ClubNew[];
   public clubsImagesUrl: string = environment.apiImageClubs;
   public errorClubs: string;
   public errorImage: string;
   public hasUnsavedChanges: boolean;
   public spinnerButton: boolean;
   public userEditForm: FormGroup;
   public userImageDefault: string = environment.imageUserDefault;
   public userImagesUrl: string = environment.apiImageUsers;

   constructor(
      private authService: AuthNewService,
      private clubService: ClubService,
      private imageService: ImageService,
      private notificationsService: NotificationsService,
      private router: Router,
      private titleService: TitleService,
      private userService: UserService
   ) {
      imageService.uploadedImage$.subscribe(response => {
         this.userEditForm.patchValue({ image: response });
         this.errorImage = null;
      });
      imageService.uploadError$.subscribe(response => {
         this.errorImage = response;
      });
   }

   get clubUser(): FormArray {
      return this.userEditForm.controls.club_user as FormArray;
   }

   public addClub(): void {
      this.clubUser.push(
         new FormGroup({
            club_id: new FormControl(null, [Validators.required]),
            main: new FormControl(this.clubUser.length ? 0 : 1)
         })
      );
   }

   public disableAddClubButton(): boolean {
      return this.clubUser.length >= 3;
   }

   public fileChange(event) {
      this.hasUnsavedChanges = true;
      this.imageService.fileChange(event, environment.imageSettings.user);
   }

   public findClub(clubId: number): ClubNew {
      return this.clubs.find(club => {
         return club.id.toString() === clubId.toString();
      });
   }

   public ngOnInit() {
      this.getClubsData();
      this.authenticatedUser = Object.assign({}, this.authService.getUser());
      this.resetData();
      this.titleService.setTitle('Редагувати профіль');
   }

   public onCancel(): void {
      this.authenticatedUser = Object.assign({}, this.authService.getUser());
      this.resetData();
   }

   public onSubmit() {
      this.spinnerButton = true;
      this.userService.updateUser(this.userEditForm.value).subscribe(
         response => {
            const updated = assign(this.authService.getUser(), response.user);
            this.authService.setUser(updated);
            this.authenticatedUser = this.authService.getUser();
            this.notificationsService.success('Успішно', 'Ваш профіль змінено!');
            this.spinnerButton = false;
            this.hasUnsavedChanges = false;
         },
         errors => {
            errors.forEach(error => this.notificationsService.error('Помилка', error));
            this.hasUnsavedChanges = false;
            this.spinnerButton = false;
         }
      );
   }

   public onSelectMainClub(index: number): void {
      this.clubUser.controls.forEach((item, i) => {
         if (index !== i) {
            item.patchValue({ main: 0 });
         }
      });
   }

   public removeClub(index: number): void {
      let setMain = false;
      if (this.clubUser.at(index).get('main').value === 1) {
         setMain = true;
      }
      this.clubUser.removeAt(index);
      if (setMain) {
         this.setMain(0);
      }
   }

   public setMain(index: number = 0): void {
      if (this.clubUser.length) {
         this.clubUser.at(index).patchValue({ main: 1 });
      }
   }

   private getClubsData() {
      this.clubService.getClubs(null, 'clubs').subscribe(
         response => {
            if (response) {
               this.clubs = response.clubs;
            }
         },
         error => {
            this.errorClubs = error;
         }
      );
   }

   private resetData(): void {
      this.errorImage = null;
      this.userEditForm = new FormGroup(
         {
            id: new FormControl(this.authenticatedUser.id),
            first_name: new FormControl(this.authenticatedUser.first_name, [Validators.maxLength(50)]),
            hometown: new FormControl(this.authenticatedUser.hometown, [Validators.maxLength(50)]),
            image: new FormControl(''),
            club_user: new FormArray([])
         },
         this.validateClubUser
      );

      if (this.authenticatedUser.clubs) {
         this.authenticatedUser.clubs.forEach(club => {
            this.clubUser.push(
               new FormGroup({
                  club_id: new FormControl(club.id.toString(), [Validators.required]),
                  main: new FormControl(club.pivot.main)
               })
            );
         });
      }
   }

   private validateClubUser(formGroup: FormGroup) {
      const values = [];
      const clubUser = formGroup.controls.club_user as FormArray;

      if (!clubUser.length) {
         return null;
      }

      for (const i in clubUser.controls) {
         if (clubUser.controls[i]) {
            const control = clubUser.at(parseInt(i, 10)).get('club_id');
            if (!control || !control.value) {
               return null;
            }
            if (values.includes(control.value)) {
               return { clubUserEqality: true };
            } else {
               values.push(control.value);
            }
         }
      }

      return null;
   }
}
