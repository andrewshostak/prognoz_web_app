import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';

import { ClubNew } from '@models/v2/club-new.model';
import { ClubNewService } from '@services/new/club-new.service';
import { FormValidatorService } from '@services/form-validator.service';
import { UtilsService } from '@services/utils.service';
import { NotificationsService } from 'angular2-notifications';

@Component({
   selector: 'app-club-form',
   templateUrl: './club-form.component.html',
   styleUrls: ['./club-form.component.scss']
})
export class ClubFormComponent implements OnChanges, OnInit {
   @Input() public club: ClubNew;
   @Output() public successfullySubmitted = new EventEmitter<ClubNew>();

   public clubForm: FormGroup;
   public clubImageExtensions: string[];
   public clubImageSize: number;

   constructor(
      private clubService: ClubNewService,
      private formValidatorService: FormValidatorService,
      private notificationsService: NotificationsService
   ) {}

   get isUpdatePage(): boolean {
      return !!(this.club && this.club.id);
   }

   public ngOnChanges(changes: SimpleChanges): void {
      UtilsService.patchSimpleChangeValuesInForm(changes, this.clubForm, 'club', this.patchClubValuesInForm);
      if (!changes.club.isFirstChange()) {
         this.clubForm.removeControl('image');
         this.clubForm.addControl(
            'image',
            new FormControl(null, [
               this.formValidatorService.fileType(this.clubImageExtensions),
               this.formValidatorService.fileSize(this.clubImageSize)
            ])
         );
      }
   }

   public ngOnInit(): void {
      this.clubImageExtensions = FormValidatorService.fileExtensions.clubImage;
      this.clubImageSize = FormValidatorService.fileSizeLimits.clubImage;
      this.setClubForm();
   }

   public showFormErrorMessage(abstractControl: AbstractControl, errorKey: string): boolean {
      return UtilsService.showFormErrorMessage(abstractControl, errorKey);
   }

   public showFormInvalidClass(abstractControl: AbstractControl): boolean {
      return UtilsService.showFormInvalidClass(abstractControl);
   }

   public submit(): void {
      if (this.clubForm.invalid) {
         return;
      }

      this.isUpdatePage ? this.updateClub(this.clubForm.getRawValue()) : this.createClub(this.clubForm.getRawValue());
   }

   private createClub(club: Partial<ClubNew>): void {
      this.clubService.createClub(club).subscribe(response => {
         this.notificationsService.success('Успішно', `Команду ${response.title} створено`);
         this.successfullySubmitted.emit(response);
      });
   }

   private patchClubValuesInForm(formGroup, field, value) {
      switch (field) {
         case 'image':
            return formGroup.get('image').setValue(null);
         default:
            return formGroup.get(field) && formGroup.patchValue({ [field]: value });
      }
   }

   private setClubForm(): void {
      this.clubForm = new FormGroup({
         title: new FormControl(null, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
         link: new FormControl(null, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
         parent_id: new FormControl(null),
         image: new FormControl(null, [
            Validators.required,
            this.formValidatorService.fileType(this.clubImageExtensions),
            this.formValidatorService.fileSize(this.clubImageSize)
         ])
      });
   }

   private updateClub(club: Partial<ClubNew>): void {
      this.clubService.updateClub(this.club.id, club).subscribe(response => {
         this.notificationsService.success('Успішно', `Команду ${response.title} змінено`);
         this.successfullySubmitted.emit(response);
      });
   }
}
