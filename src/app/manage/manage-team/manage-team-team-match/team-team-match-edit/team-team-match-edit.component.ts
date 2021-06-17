import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Sequence } from '@enums/sequence.enum';
import { TeamStageState } from '@enums/team-stage-state.enum';
import { TeamStageNew } from '@models/new/team-stage-new.model';
import { TeamStageSearch } from '@models/search/team-stage-search.model';
import { TeamTeamMatchNew } from '@models/new/team-team-match-new.model';
import { TeamStageNewService } from '@services/new/team-stage-new.service';
import { TeamTeamMatchNewService } from '@services/new/team-team-match-new.service';
import { SettingsService } from '@services/settings.service';
import { UtilsService } from '@services/utils.service';
import { NotificationsService } from 'angular2-notifications';
import { uniqBy } from 'lodash';

@Component({
   selector: 'app-team-team-match-edit',
   templateUrl: './team-team-match-edit.component.html',
   styleUrls: ['./team-team-match-edit.component.scss']
})
export class TeamTeamMatchEditComponent implements OnInit {
   constructor(
      private activatedRoute: ActivatedRoute,
      private notificationsService: NotificationsService,
      private router: Router,
      private teamStageService: TeamStageNewService,
      private teamTeamMatchService: TeamTeamMatchNewService
   ) {}

   public teamTeamMatch: TeamTeamMatchNew;
   public teamStages: TeamStageNew[] = [];
   public teamTeamMatchForm: FormGroup;

   public ngOnInit(): void {
      this.getTeamStagesData();
      this.getTeamTeamMatchData(this.activatedRoute.snapshot.params.id);
      this.teamTeamMatchForm = new FormGroup({
         team_stage_id: new FormControl(null, [Validators.required]),
         home_team_id: new FormControl(null, [Validators.required]),
         away_team_id: new FormControl(null, [Validators.required])
      });
   }

   public onSubmit(): void {
      if (this.teamTeamMatchForm.invalid) {
         return;
      }

      this.updateTeamTeamMatch(this.teamTeamMatchForm.value);
   }

   public showFormErrorMessage(abstractControl: AbstractControl, errorKey: string): boolean {
      return UtilsService.showFormErrorMessage(abstractControl, errorKey);
   }

   public showFormInvalidClass(abstractControl: AbstractControl): boolean {
      return UtilsService.showFormInvalidClass(abstractControl);
   }

   private getTeamTeamMatchData(id: number): void {
      this.teamTeamMatchService.getTeamTeamMatch(id, ['teamStage.competition', 'homeTeam', 'awayTeam']).subscribe(response => {
         this.teamTeamMatch = response;
         this.handleTeamTeamMatchResponse(this.teamTeamMatch);
      });
   }

   private getTeamStagesData(): void {
      const search: TeamStageSearch = {
         page: 1,
         orderBy: 'id',
         sequence: Sequence.Ascending,
         limit: SettingsService.maxLimitValues.teamStages,
         relations: ['competition', 'teamStageType'],
         states: [TeamStageState.NotStarted, TeamStageState.Active]
      };
      this.teamStageService.getTeamStages(search).subscribe(response => {
         this.teamStages = uniqBy(this.teamStages.concat(response.data), 'id');
      });
   }

   private handleTeamTeamMatchResponse(teamTeamMatch: TeamTeamMatchNew): void {
      this.teamTeamMatchForm.patchValue(teamTeamMatch);
      if (teamTeamMatch.team_stage) {
         this.teamStages = uniqBy(this.teamStages.concat([teamTeamMatch.team_stage]), 'id');
      }

      if (teamTeamMatch.active || teamTeamMatch.ended) {
         this.teamTeamMatchForm.disable();
      }
   }

   private updateTeamTeamMatch(teamTeamMatch: Partial<TeamTeamMatchNew>): void {
      this.teamTeamMatchService.updateTeamTeamMatch(this.teamTeamMatch.id, teamTeamMatch).subscribe(() => {
         this.notificationsService.success('Успішно', 'Матч між командами змінено');
         this.router.navigate(['/manage', 'team', 'team-matches']);
      });
   }
}
