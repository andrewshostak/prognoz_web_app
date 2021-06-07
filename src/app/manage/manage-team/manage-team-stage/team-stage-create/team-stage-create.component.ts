import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';

import { ModelStatus } from '@enums/model-status.enum';
import { TeamStageTypeNew } from '@models/new/team-stage-type-new.model';
import { CompetitionNew } from '@models/new/competition-new.model';
import { CompetitionSearch } from '@models/search/competition-search.model';
import { TeamStageNew } from '@models/new/team-stage-new.model';
import { TeamStageTypeNewService } from '@services/new/team-stage-type-new.service';
import { CompetitionNewService } from '@services/new/competition-new.service';
import { SettingsService } from '@services/settings.service';
import { TeamStageNewService } from '@services/new/team-stage-new.service';
import { NotificationsService } from 'angular2-notifications';
import { UtilsService } from '@services/utils.service';
import { Tournament } from '@enums/tournament.enum';

@Component({
   selector: 'app-team-stage-create',
   templateUrl: './team-stage-create.component.html',
   styleUrls: ['./team-stage-create.component.scss']
})
export class TeamStageCreateComponent implements OnInit {
   constructor(
      private competitionService: CompetitionNewService,
      private notificationsService: NotificationsService,
      private teamStageService: TeamStageNewService,
      private teamStageTypeService: TeamStageTypeNewService
   ) {}

   public teamStageForm: FormGroup;
   public competitions: CompetitionNew[] = [];
   public teamStageTypes: TeamStageTypeNew[] = [];

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

   private createTeamStage(teamStage: Partial<TeamStageNew>): void {
      this.teamStageService.createTeamStage(teamStage).subscribe(response => {
         this.notificationsService.success('Успішно', `Командну стадію ${response.title} створено`);
         this.teamStageForm.reset();
      });
   }

   private getCompetitionsData(): void {
      const search: CompetitionSearch = {
         ended: ModelStatus.Falsy,
         page: 1,
         limit: SettingsService.maxLimitValues.competitions,
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
