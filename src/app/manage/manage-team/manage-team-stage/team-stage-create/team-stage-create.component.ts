import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { CompetitionState } from '@enums/competition-state.enum';
import { Tournament } from '@enums/tournament.enum';
import { TeamStageType } from '@models/v2/team/team-stage-type.model';
import { Competition } from '@models/v2/competition.model';
import { CompetitionSearch } from '@models/search/competition-search.model';
import { TeamStage } from '@models/v2/team/team-stage.model';
import { TeamStageTypeNewService } from '@services/new/team-stage-type-new.service';
import { CompetitionNewService } from '@services/new/competition-new.service';
import { SettingsService } from '@services/settings.service';
import { TeamStageNewService } from '@services/new/team-stage-new.service';
import { UtilsService } from '@services/utils.service';
import { NotificationsService } from 'angular2-notifications';

@Component({
   selector: 'app-team-stage-create',
   templateUrl: './team-stage-create.component.html',
   styleUrls: ['./team-stage-create.component.scss']
})
export class TeamStageCreateComponent implements OnInit {
   constructor(
      private competitionService: CompetitionNewService,
      private notificationsService: NotificationsService,
      private router: Router,
      private teamStageService: TeamStageNewService,
      private teamStageTypeService: TeamStageTypeNewService
   ) {}

   public teamStageForm: FormGroup;
   public competitions: Competition[] = [];
   public teamStageTypes: TeamStageType[] = [];

   public ngOnInit(): void {
      this.getCompetitionsData();
      this.getTeamStageTypesData();
      this.teamStageForm = new FormGroup({
         team_stage_type_id: new FormControl(null, [Validators.required]),
         competition_id: new FormControl(null, [Validators.required]),
         title: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
         round: new FormControl(null, [Validators.required, Validators.min(1)])
      });
   }

   public onSubmit(): void {
      if (this.teamStageForm.invalid) {
         return;
      }

      this.createTeamStage(this.teamStageForm.value);
   }

   public showFormErrorMessage(abstractControl: AbstractControl, errorKey: string): boolean {
      return UtilsService.showFormErrorMessage(abstractControl, errorKey);
   }

   public showFormInvalidClass(abstractControl: AbstractControl): boolean {
      return UtilsService.showFormInvalidClass(abstractControl);
   }

   private createTeamStage(teamStage: Partial<TeamStage>): void {
      this.teamStageService.createTeamStage(teamStage).subscribe(response => {
         this.notificationsService.success('Успішно', `Командну стадію ${response.title} створено`);
         this.router.navigate(['/manage', 'team', 'stages']);
      });
   }

   private getCompetitionsData(): void {
      const search: CompetitionSearch = {
         page: 1,
         limit: SettingsService.maxLimitValues.competitions,
         states: [CompetitionState.NotStarted, CompetitionState.Applications, CompetitionState.Active],
         tournamentId: Tournament.Team
      };
      this.competitionService.getCompetitions(search).subscribe(response => {
         this.competitions = response.data;
      });
   }

   private getTeamStageTypesData(): void {
      this.teamStageTypeService.getTeamStageTypes().subscribe(response => {
         this.teamStageTypes = response.data;
      });
   }
}
