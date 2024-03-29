import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';

import { TeamStageState } from '@enums/team-stage-state.enum';
import { TeamStageType } from '@enums/team-stage-type.enum';
import { Sequence } from '@enums/sequence.enum';
import { TeamStage } from '@models/v2/team/team-stage.model';
import { TeamStageSearch } from '@models/search/team/team-stage-search.model';
import { TeamTeamMatch } from '@models/v2/team/team-team-match.model';
import { UtilsService } from '@services/utils.service';
import { PaginationService } from '@services/pagination.service';
import { TeamStageService } from '@services/api/v2/team/team-stage.service';
import { TeamTeamMatchService } from '@services/api/v2/team/team-team-match.service';
import { NotificationsService } from 'angular2-notifications';

@Component({
   selector: 'app-team-team-match-create',
   templateUrl: './team-team-match-create.component.html',
   styleUrls: ['./team-team-match-create.component.scss']
})
export class TeamTeamMatchCreateComponent implements OnInit {
   constructor(
      private notificationsService: NotificationsService,
      private teamStageService: TeamStageService,
      private teamTeamMatchService: TeamTeamMatchService
   ) {}

   public teamStages: TeamStage[] = [];
   public teamTeamMatchForm: FormGroup;

   public ngOnInit(): void {
      this.getTeamStagesData();
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

      this.createTeamTeamMatch(this.teamTeamMatchForm.value);
   }

   public showFormErrorMessage(abstractControl: AbstractControl, errorKey: string): boolean {
      return UtilsService.showFormErrorMessage(abstractControl, errorKey);
   }

   public showFormInvalidClass(abstractControl: AbstractControl): boolean {
      return UtilsService.showFormInvalidClass(abstractControl);
   }

   private createTeamTeamMatch(teamTeamMatch: Partial<TeamTeamMatch>): void {
      this.teamTeamMatchService.createTeamTeamMatch(teamTeamMatch).subscribe(() => {
         this.notificationsService.success('Успішно', `Матч між командами створено`);
         this.teamTeamMatchForm.get('home_team_id').reset();
         this.teamTeamMatchForm.get('away_team_id').reset();
      });
   }

   private getTeamStagesData(): void {
      const search: TeamStageSearch = {
         page: 1,
         orderBy: 'title',
         sequence: Sequence.Descending,
         limit: PaginationService.limit.teamStages,
         relations: ['competition', 'teamStageType'],
         states: [TeamStageState.NotStarted, TeamStageState.Active]
      };
      this.teamStageService.getTeamStages(search).subscribe(response => {
         this.teamStages = response.data;
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
