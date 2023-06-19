import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { User } from '@models/v2/user.model';
import { FormValidatorService } from '@services/form-validator.service';
import { AuthService } from '@services/v2/auth.service';
import { UserService } from '@services/v2/user.service';
import { SettingsService } from '@services/settings.service';
import { TitleService } from '@services/title.service';
import { UtilsService } from '@services/utils.service';
import { NotificationsService } from 'angular2-notifications';
import { assign } from 'lodash';

@Component({
   selector: 'app-me',
   templateUrl: './me.component.html',
   styleUrls: ['./me.component.scss']
})
export class MeComponent implements OnInit {
   public authenticatedUser: User;
   public spinnerButton: boolean;
   public userEditForm: FormGroup;
   public userImageDefault: string = SettingsService.userDefaultImage;
   public userImagesUrl: string = SettingsService.usersLogosPath;
   public userImageExtensions: string[] = FormValidatorService.fileExtensions.userImage;
   public userImageSize: number = FormValidatorService.fileSizeLimits.userImage;

   constructor(
      private authService: AuthService,
      private formValidatorService: FormValidatorService,
      private notificationsService: NotificationsService,
      private router: Router,
      private titleService: TitleService,
      private userService: UserService
   ) {}

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

   public ngOnInit() {
      this.authenticatedUser = Object.assign({}, this.authService.getUser());
      this.setForm(this.authenticatedUser);
      this.titleService.setTitle('Редагувати профіль');
   }

   public onSubmit() {
      this.spinnerButton = true;
      this.userService.updateUser(this.authenticatedUser.id, this.userEditForm.value).subscribe(
         response => {
            const updated = assign(this.authService.getUser(), response);
            this.authService.setUser(updated);
            this.authenticatedUser = this.authService.getUser();
            this.notificationsService.success('Успішно', 'Інформацію змінено');
            this.spinnerButton = false;
            this.userEditForm.get('image').reset();
         },
         () => (this.spinnerButton = false)
      );
   }

   public onSelectMainClub(index: number): void {
      this.clubUser.controls.forEach((item, i) => {
         item.patchValue({ main: index === i ? 1 : 0 });
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

   public showFormErrorMessage(abstractControl: AbstractControl, errorKey: string): boolean {
      return UtilsService.showFormErrorMessage(abstractControl, errorKey);
   }

   public showFormInvalidClass(abstractControl: AbstractControl): boolean {
      return UtilsService.showFormInvalidClass(abstractControl);
   }

   private setForm(authenticatedUser: User): void {
      this.userEditForm = new FormGroup(
         {
            id: new FormControl(authenticatedUser.id),
            first_name: new FormControl(authenticatedUser.first_name, [Validators.maxLength(50)]),
            hometown: new FormControl(authenticatedUser.hometown, [Validators.maxLength(50)]),
            image: new FormControl(null, [
               this.formValidatorService.fileType(this.userImageExtensions),
               this.formValidatorService.fileSize(this.userImageSize)
            ]),
            club_user: new FormArray([])
         },
         this.validateClubUser
      );

      if (authenticatedUser.clubs) {
         authenticatedUser.clubs.forEach(club => {
            this.clubUser.push(
               new FormGroup({
                  club_id: new FormControl(club.id, [Validators.required]),
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
               return { clubUserEquality: true };
            } else {
               values.push(control.value);
            }
         }
      }

      return null;
   }
}
