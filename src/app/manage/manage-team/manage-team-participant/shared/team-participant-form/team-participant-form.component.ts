import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { CompetitionState } from '@enums/competition-state.enum';
import { Tournament } from '@enums/tournament.enum';
import { Competition } from '@models/v2/competition.model';
import { Team } from '@models/v2/team/team.model';
import { TeamParticipant } from '@models/v2/team/team-participant.model';
import { User } from '@models/v2/user.model';
import { CompetitionSearch } from '@models/search/competition-search.model';
import { CompetitionService } from '@services/v2/competition.service';
import { TeamService } from '@services/v2/team/team.service';
import { TeamParticipantService } from '@services/v2/team/team-participant.service';
import { UserService } from '@services/v2/user.service';
import { PaginationService } from '@services/pagination.service';
import { UtilsService } from '@services/utils.service';
import { NotificationsService } from 'angular2-notifications';
import { uniqBy } from 'lodash';

@Component({
   selector: 'app-team-participant-form',
   templateUrl: './team-participant-form.component.html',
   styleUrls: ['./team-participant-form.component.scss']
})
export class TeamParticipantFormComponent implements OnChanges, OnInit {
   @Input() public teamParticipant: TeamParticipant;

   public competitions: Competition[];
   public team: Team;
   public teamParticipantForm: FormGroup;
   public user: User;

   constructor(
      private competitionService: CompetitionService,
      private notificationsService: NotificationsService,
      private router: Router,
      private teamService: TeamService,
      private teamParticipantService: TeamParticipantService,
      private userService: UserService
   ) {}

   public ngOnChanges(changes: SimpleChanges) {
      UtilsService.patchSimpleChangeValuesInForm(changes, this.teamParticipantForm, 'teamParticipant');
      if (changes.teamParticipant && !changes.teamParticipant.isFirstChange() && changes.teamParticipant.currentValue) {
         this.getTeamData(changes.teamParticipant.currentValue.team_id);
         this.getUserData(changes.teamParticipant.currentValue.user_id);
         this.getCurrentCompetitionData(changes.teamParticipant.currentValue);
      }
   }

   public ngOnInit() {
      this.competitions = [];
      this.getNotEndedCompetitionsData();
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

   public submit(): void {
      if (this.teamParticipantForm.invalid) {
         return;
      }

      this.teamParticipant
         ? this.updateTeamParticipant(this.teamParticipantForm.value)
         : this.createTeamParticipant(this.teamParticipantForm.value);
   }

   public showFormErrorMessage(abstractControl: AbstractControl, errorKey: string): boolean {
      return UtilsService.showFormErrorMessage(abstractControl, errorKey);
   }

   public showFormInvalidClass(abstractControl: AbstractControl): boolean {
      return UtilsService.showFormInvalidClass(abstractControl);
   }

   private getCurrentCompetitionData(teamParticipant: TeamParticipant): void {
      this.competitionService.getCompetition(teamParticipant.competition_id).subscribe(response => {
         const competitions = [...this.competitions, ...[response]];
         this.competitions = uniqBy(competitions, 'id');
      });
   }

   private getNotEndedCompetitionsData(): void {
      const search: CompetitionSearch = {
         limit: PaginationService.limit.competitions,
         page: 1,
         states: [CompetitionState.NotStarted, CompetitionState.Applications, CompetitionState.Active],
         tournamentId: Tournament.Team
      };

      this.competitionService.getCompetitions(search).subscribe(response => {
         const competitions = [...this.competitions, ...response.data];
         this.competitions = uniqBy(competitions, 'id');
      });
   }

   private getTeamData(teamId: number): void {
      this.teamService.getTeam(teamId).subscribe(response => (this.team = response));
   }

   private getUserData(userId: number): void {
      this.userService.getUser(userId).subscribe(response => (this.user = response));
   }

   private createTeamParticipant(teamParticipant: Partial<TeamParticipant>): void {
      this.teamParticipantService.createTeamParticipant(teamParticipant).subscribe(response => {
         this.notificationsService.success('Успішно', 'Заявку / Учасника створено');
         this.router.navigate(['/manage', 'team', 'participants', response.id, 'edit']);
      });
   }

   private updateTeamParticipant(teamParticipant: Partial<TeamParticipant>): void {
      this.teamParticipantService.updateTeamParticipant(this.teamParticipant.id, teamParticipant).subscribe(() => {
         this.notificationsService.success('Успішно', 'Заявку / Учасника змінено');
      });
   }
}
