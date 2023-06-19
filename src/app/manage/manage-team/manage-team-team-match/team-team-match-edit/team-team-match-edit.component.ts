import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Sequence } from '@enums/sequence.enum';
import { TeamStageState } from '@enums/team-stage-state.enum';
import { TeamStageType } from '@enums/team-stage-type.enum';
import { TeamTeamMatchState } from '@enums/team-team-match-state.enum';
import { TeamStage } from '@models/v2/team/team-stage.model';
import { TeamStageSearch } from '@models/search/team/team-stage-search.model';
import { TeamTeamMatch } from '@models/v2/team/team-team-match.model';
import { TeamStageService } from '@services/v2/team/team-stage.service';
import { TeamTeamMatchService } from '@services/v2/team/team-team-match.service';
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
      private teamStageService: TeamStageService,
      private teamTeamMatchService: TeamTeamMatchService
   ) {}

   public teamTeamMatch: TeamTeamMatch;
   public teamStages: TeamStage[] = [];
   public teamTeamMatchForm: FormGroup;

   public ngOnInit(): void {
      this.getTeamStagesData();
      this.getTeamTeamMatchData(this.activatedRoute.snapshot.params.id);
      this.teamTeamMatchForm = new FormGroup({
         team_stage_id: new FormControl(null, [Validators.required]),
         home_team_id: new FormControl(null, [Validators.required]),
         away_team_id: new FormControl(null, [Validators.required])
      });
      this.subscribeToTeamStageChanges();
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
      this.teamTeamMatchService
         .getTeamTeamMatch(id, ['teamStage.competition', 'teamStage.teamStageType', 'homeTeam', 'awayTeam'])
         .subscribe(response => {
            this.teamTeamMatch = response;
            this.handleTeamTeamMatchResponse(this.teamTeamMatch);
         });
   }

   private getTeamStagesData(): void {
      const search: TeamStageSearch = {
         page: 1,
         orderBy: 'title',
         sequence: Sequence.Descending,
         limit: SettingsService.maxLimitValues.teamStages,
         relations: ['competition', 'teamStageType'],
         states: [TeamStageState.NotStarted, TeamStageState.Active]
      };
      this.teamStageService.getTeamStages(search).subscribe(response => {
         this.teamStages = uniqBy(this.teamStages.concat(response.data), 'id');
      });
   }

   private handleTeamTeamMatchResponse(teamTeamMatch: TeamTeamMatch): void {
      if (teamTeamMatch.team_stage) {
         this.teamStages = uniqBy(this.teamStages.concat([teamTeamMatch.team_stage]), 'id');
      }

      this.teamTeamMatchForm.patchValue(teamTeamMatch);

      if (teamTeamMatch.state !== TeamTeamMatchState.NotStarted) {
         this.teamTeamMatchForm.disable();
      }
   }

   private updateTeamTeamMatch(teamTeamMatch: Partial<TeamTeamMatch>): void {
      this.teamTeamMatchService.updateTeamTeamMatch(this.teamTeamMatch.id, teamTeamMatch).subscribe(() => {
         this.notificationsService.success('Успішно', 'Матч між командами змінено');
         this.router.navigate(['/manage', 'team', 'team-matches']);
      });
   }

   public isTeamCupGroupStage(teamStageId: number): boolean {
      const stage = this.teamStages.find(teamStage => teamStage.id === teamStageId);
      if (!stage) {
         return false;
      }

      return stage.team_stage_type.id === TeamStageType.CupGroupRound;
   }

   private subscribeToTeamStageChanges(): void {
      this.teamTeamMatchForm.get('team_stage_id').valueChanges.subscribe(id => {
         if (this.isTeamCupGroupStage(id)) {
            this.teamTeamMatchForm.addControl('group_number', new FormControl(null, [Validators.required]));
         } else {
            this.teamTeamMatchForm.removeControl('group_number');
         }
      });
   }
}
