import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';

import { TeamNew } from '@models/new/team-new.model';
import { UserNew } from '@models/new/user-new.model';
import { FormValidatorService } from '@services/form-validator.service';
import { TeamNewService } from '@services/new/team-new.service';
import { UtilsService } from '@services/utils.service';
import { NotificationsService } from 'angular2-notifications';

@Component({
   selector: 'app-team-form',
   templateUrl: './team-form.component.html',
   styleUrls: ['./team-form.component.scss']
})
export class TeamFormComponent implements OnInit {
   @Input() public team: TeamNew;
   @Input() public captain: UserNew;

   public teamForm: FormGroup;

   constructor(
      private formValidatorService: FormValidatorService,
      private notificationsService: NotificationsService,
      private teamService: TeamNewService
   ) {}

   public ngOnInit(): void {
      this.setTeamForm();
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

      this.team ? this.updateTeam() : this.createTeam(this.teamForm.value);
   }

   private createTeam(team: Partial<TeamNew>): void {
      this.teamService.createTeam(team).subscribe(response => {
         this.notificationsService.success('Успішно', `Команду ${response.name} створено`);
      });
   }

   private setTeamForm(): void {
      this.teamForm = new FormGroup({
         name: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(30)]),
         caption: new FormControl(null, [Validators.maxLength(140)]),
         captain_id: new FormControl({ value: null, disabled: this.captain }, [Validators.required]),
         image: new FormControl(null, [this.formValidatorService.requiredFileType(['png', 'jpg', 'jpeg'])])
      });
   }

   // tslint:disable-next-line:no-empty
   private updateTeam(): void {}
}
