import { Location } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { environment } from '@env';
import { Competition } from '@models/competition.model';
import { TeamNew } from '@models/new/team-new.model';
import { TeamParticipant } from '@models/team/team-participant.model';
import { User } from '@models/user.model';
import { CompetitionService } from '@services/competition.service';
import { TeamNewService } from '@services/new/team-new.service';
import { TeamParticipantService } from '@services/team/team-participant.service';
import { UserService } from '@services/user.service';
import { UtilsService } from '@services/utils.service';
import { NotificationsService } from 'angular2-notifications';

@Component({
   selector: 'app-team-participant-form',
   templateUrl: './team-participant-form.component.html',
   styleUrls: ['./team-participant-form.component.scss']
})
export class TeamParticipantFormComponent implements OnChanges, OnInit {
   @Input() public teamParticipant: TeamParticipant;

   public competitions: Competition[];
   public errorCompetitions: string;
   public errorTeams: string;
   public errorUsers: string;
   public team: TeamNew;
   public teamParticipantForm: FormGroup;
   public users: User[];

   constructor(
      private competitionService: CompetitionService,
      private location: Location,
      private notificationsService: NotificationsService,
      private router: Router,
      private teamService: TeamNewService,
      private teamParticipantService: TeamParticipantService,
      private userService: UserService
   ) {}

   public ngOnChanges(simpleChanges: SimpleChanges) {
      UtilsService.patchSimpleChangeValuesInForm(simpleChanges, this.teamParticipantForm, 'teamParticipant');
      if (simpleChanges.teamParticipant && !simpleChanges.teamParticipant.isFirstChange() && simpleChanges.teamParticipant.currentValue) {
         this.getTeamData(simpleChanges.teamParticipant.currentValue.team_id);
      }
   }

   public ngOnInit() {
      this.getCompetitionsData();
      this.getUsersData();
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

   private getUsersData(): void {
      this.userService.getUsers(null, 'name', 'asc').subscribe(
         response => {
            this.users = response.users;
         },
         error => {
            this.errorUsers = error;
         }
      );
   }

   private createTeamParticipant(teamParticipant: TeamParticipant): void {
      this.teamParticipantService.createTeamParticipant(teamParticipant).subscribe(
         response => {
            this.notificationsService.success('Успішно', 'Заявку / Учасника створено');
            this.router.navigate(['/manage', 'team', 'participants', response.id, 'edit']);
         },
         errors => {
            errors.forEach(error => this.notificationsService.error('Помилка', error));
         }
      );
   }

   private updateTeamParticipant(teamParticipant: TeamParticipant): void {
      teamParticipant.id = this.teamParticipant.id;
      this.teamParticipantService.updateTeamParticipant(teamParticipant).subscribe(
         () => {
            this.notificationsService.success('Успішно', 'Заявку / Учасника змінено');
            this.location.back();
         },
         errors => {
            errors.forEach(error => this.notificationsService.error('Помилка', error));
         }
      );
   }
}
