import { Location } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { environment } from '@env';
import { Competition } from '@models/competition.model';
import { TeamNew } from '@models/new/team-new.model';
import { TeamParticipantNew } from '@models/new/team-participant-new.model';
import { UserNew } from '@models/new/user-new.model';
import { CompetitionService } from '@services/competition.service';
import { TeamNewService } from '@services/new/team-new.service';
import { TeamParticipantNewService } from '@services/new/team-participant-new.service';
import { UserNewService } from '@services/new/user-new.service';
import { UtilsService } from '@services/utils.service';
import { NotificationsService } from 'angular2-notifications';

@Component({
   selector: 'app-team-participant-form',
   templateUrl: './team-participant-form.component.html',
   styleUrls: ['./team-participant-form.component.scss']
})
export class TeamParticipantFormComponent implements OnChanges, OnInit {
   @Input() public teamParticipant: TeamParticipantNew;

   public competitions: Competition[];
   public errorCompetitions: string;
   public team: TeamNew;
   public teamParticipantForm: FormGroup;
   public user: UserNew;

   constructor(
      private competitionService: CompetitionService,
      private location: Location,
      private notificationsService: NotificationsService,
      private router: Router,
      private teamService: TeamNewService,
      private teamParticipantService: TeamParticipantNewService,
      private userService: UserNewService
   ) {}

   public ngOnChanges(changes: SimpleChanges) {
      UtilsService.patchSimpleChangeValuesInForm(changes, this.teamParticipantForm, 'teamParticipant');
      if (changes.teamParticipant && !changes.teamParticipant.isFirstChange() && changes.teamParticipant.currentValue) {
         this.getTeamData(changes.teamParticipant.currentValue.team_id);
         this.getUserData(changes.teamParticipant.currentValue.user_id);
      }
   }

   public ngOnInit() {
      this.getCompetitionsData();
      this.teamParticipantForm = new FormGroup({
         team_id: new FormControl('', [Validators.required]),
         user_id: new FormControl('', [Validators.required]),
         competition_id: new FormControl('', [Validators.required]),
         captain: new FormControl(false),
         confirmed: new FormControl(false),
         refused: new FormControl(false),
         ended: new FormControl(false)
      });
   }

   public onSubmit(): void {
      if (this.teamParticipantForm.valid) {
         this.teamParticipant
            ? this.updateTeamParticipant(this.teamParticipantForm.value)
            : this.createTeamParticipant(this.teamParticipantForm.value);
      }
   }

   public resetTeamParticipantForm(): void {
      this.teamParticipantForm.reset();
   }

   public showFormErrorMessage(abstractControl: AbstractControl, errorKey: string): boolean {
      return UtilsService.showFormErrorMessage(abstractControl, errorKey);
   }

   public showFormInvalidClass(abstractControl: AbstractControl): boolean {
      return UtilsService.showFormInvalidClass(abstractControl);
   }

   private getCompetitionsData(): void {
      this.competitionService.getCompetitions(null, environment.tournaments.team.id, null, null, true, true).subscribe(
         response => {
            this.competitions = response.competitions;
         },
         error => {
            this.errorCompetitions = error;
         }
      );
   }

   private getTeamData(teamId: number): void {
      this.teamService.getTeam(teamId).subscribe(response => (this.team = response));
   }

   private getUserData(userId: number): void {
      this.userService.getUser(userId).subscribe(response => (this.user = response));
   }

   private createTeamParticipant(teamParticipant: Partial<TeamParticipantNew>): void {
      this.teamParticipantService.createTeamParticipant(teamParticipant).subscribe(response => {
         this.notificationsService.success('Успішно', 'Заявку / Учасника створено');
         this.router.navigate(['/manage', 'team', 'participants', response.id, 'edit']);
      });
   }

   private updateTeamParticipant(teamParticipant: Partial<TeamParticipantNew>): void {
      this.teamParticipantService.updateTeamParticipant(this.teamParticipant.id, teamParticipant).subscribe(() => {
         this.notificationsService.success('Успішно', 'Заявку / Учасника змінено');
         this.location.back();
      });
   }
}
