import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';

import { Club } from '@models/v2/club.model';
import { ClubService } from '@services/api/v2/club.service';
import { FormValidatorService } from '@services/form-validator.service';
import { SettingsService } from '@services/settings.service';
import { UtilsService } from '@services/utils.service';
import { NotificationsService } from 'angular2-notifications';
import { trim } from 'lodash';
import { merge, Observable, of, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, filter, map, switchMap, tap } from 'rxjs/operators';

@Component({
   selector: 'app-club-form',
   templateUrl: './club-form.component.html',
   styleUrls: ['./club-form.component.scss']
})
export class ClubFormComponent implements OnChanges, OnInit {
   @Input() public club: Club;
   @Output() public successfullySubmitted = new EventEmitter<Club>();

   aliases: string[] = [];
   aliases$: Observable<string[]>;
   aliasesInput$: Subject<string>;
   aliasesList$: Subject<string[]>;
   aliasesLoading: boolean;
   public clubForm: FormGroup;
   public clubImageExtensions: string[];
   public clubImageSize: number;
   ngSelectTexts: { [key: string]: string };

   constructor(
      private clubService: ClubService,
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
      if (!changes.club.isFirstChange() && changes.club.currentValue) {
         this.aliasesList$.next([changes.club.currentValue.link]);
      }
   }

   public ngOnInit(): void {
      this.clubImageExtensions = FormValidatorService.fileExtensions.clubImage;
      this.clubImageSize = FormValidatorService.fileSizeLimits.clubImage;
      this.ngSelectTexts = SettingsService.textMessages.ngSelect;
      this.setClubForm();

      this.aliasesInput$ = new Subject<string>();
      this.aliasesList$ = new Subject<string[]>();
      this.aliasesLoading = false;
      this.enableTypeAheadSearch();
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

   private createClub(club: Partial<Club>): void {
      this.clubService.createClub(club).subscribe(response => {
         this.notificationsService.success('Успішно', `Команду ${response.title} створено`);
         this.successfullySubmitted.emit(response);
      });
   }

   private enableTypeAheadSearch(): void {
      this.aliases$ = merge(
         of(this.aliases), // default aliases
         this.aliasesList$,
         this.aliasesInput$.pipe(
            distinctUntilChanged(),
            debounceTime(SettingsService.defaultDebounceTime),
            filter(term => term && term.length >= 2),
            switchMap((term: string) => {
               if (!term) {
                  return of(this.aliases);
               }

               this.aliasesLoading = true;
               return this.clubService.getClubsAliases(trim(term)).pipe(
                  catchError(() => of([])),
                  tap(() => (this.aliasesLoading = false)),
                  map((response: string[]) => response)
               );
            })
         )
      );
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

   private updateClub(club: Partial<Club>): void {
      this.clubService.updateClub(this.club.id, club).subscribe(response => {
         this.notificationsService.success('Успішно', `Команду ${response.title} змінено`);
         this.successfullySubmitted.emit(response);
      });
   }
}
