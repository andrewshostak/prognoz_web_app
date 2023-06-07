import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Team } from '@models/v2/team/team.model';
import { User } from '@models/v2/user.model';
import { FormValidatorService } from '@services/form-validator.service';
import { TeamNewService } from '@services/new/team-new.service';
import { UtilsService } from '@services/utils.service';
import { NotificationsService } from 'angular2-notifications';

@Component({
   selector: 'app-team-form',
   templateUrl: './team-form.component.html',
   styleUrls: ['./team-form.component.scss']
})
export class TeamFormComponent implements OnChanges, OnInit {
   @Input() public team: Team;
   @Input() public captainsList: User[];
   @Input() public includeAdvancedFormControls: boolean[];
   @Output() public successfullySubmitted = new EventEmitter<Team>();

   public teamImageExtensions: string[];
   public teamImageSize: number;
   public teamForm: FormGroup;

   constructor(
      private formValidatorService: FormValidatorService,
      private notificationsService: NotificationsService,
      private router: Router,
      private teamService: TeamNewService
   ) {}

   get isUpdatePage(): boolean {
      return !!(this.team && this.team.id);
   }

   public ngOnChanges(changes: SimpleChanges): void {
      UtilsService.patchSimpleChangeValuesInForm(changes, this.teamForm, 'team', this.patchTeamValuesInForm);
   }

   public ngOnInit(): void {
      this.teamImageExtensions = FormValidatorService.fileExtensions.teamImage;
      this.teamImageSize = FormValidatorService.fileSizeLimits.teamImage;
      this.setTeamForm();
      if (this.includeAdvancedFormControls) {
         this.addAdvancedFormControls(!!this.captainsList);
      }
      if (this.team) {
         this.teamForm.get('captain_id').disable();
         this.teamForm.get('captain_id').setValue(this.team.captain_id);
      }
   }

   public showFormErrorMessage(abstractControl: AbstractControl, errorKey: string): boolean {
      return UtilsService.showFormErrorMessage(abstractControl, errorKey);
   }

   public showFormInvalidClass(abstractControl: AbstractControl): boolean {
      return UtilsService.showFormInvalidClass(abstractControl);
   }

   public submit(): void {
      if (this.teamForm.invalid) {
         return;
      }

      this.isUpdatePage ? this.updateTeam(this.teamForm.getRawValue()) : this.createTeam(this.teamForm.getRawValue());
   }

   private addAdvancedFormControls(disabled: boolean): void {
      if (!this.teamForm) {
         return;
      }

      this.teamForm.addControl('stated', new FormControl({ value: false, disabled }));
      this.teamForm.addControl('confirmed', new FormControl({ value: false, disabled }));
   }

   private createTeam(team: Partial<Team>): void {
      this.teamService.createTeam(team).subscribe(response => {
         this.notificationsService.success('Успішно', `Команду ${response.name} створено`);
         if (this.successfullySubmitted.observers.length) {
            this.successfullySubmitted.emit(response);
         }
      });
   }

   private patchTeamValuesInForm(formGroup, field, value) {
      switch (field) {
         case 'image':
            return formGroup.get('image').setValue(null);
         case 'stated':
            return formGroup.get('stated').setValue(Boolean(value));
         case 'confirmed':
            return formGroup.get('confirmed').setValue(Boolean(value));
         default:
            return formGroup.get(field) && formGroup.patchValue({ [field]: value });
      }
   }

   private setTeamForm(): void {
      this.teamForm = new FormGroup({
         name: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(30)]),
         caption: new FormControl(null, [Validators.maxLength(140)]),
         captain_id: new FormControl(null, [Validators.required]),
         image: new FormControl(null, [
            this.formValidatorService.fileType(this.teamImageExtensions),
            this.formValidatorService.fileSize(this.teamImageSize)
         ])
      });
   }

   private updateTeam(team: Partial<Team>): void {
      this.teamService.updateTeam(this.team.id, team).subscribe(response => {
         this.notificationsService.success('Успішно', `Команду ${response.name} змінено`);
         this.captainsList = [response.captain];
         this.team = response;
         UtilsService.patchObjectValuesInForm(response, this.teamForm, this.patchTeamValuesInForm);
      });
   }
}
