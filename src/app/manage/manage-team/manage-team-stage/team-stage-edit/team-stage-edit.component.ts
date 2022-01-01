import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Tournament } from '@enums/tournament.enum';
import { CompetitionState } from '@enums/competition-state.enum';
import { TeamStageNew } from '@models/new/team-stage-new.model';
import { CompetitionSearch } from '@models/search/competition-search.model';
import { CompetitionNew } from '@models/new/competition-new.model';
import { TeamStageTypeNew } from '@models/new/team-stage-type-new.model';
import { TeamStageNewService } from '@services/new/team-stage-new.service';
import { SettingsService } from '@services/settings.service';
import { CompetitionNewService } from '@services/new/competition-new.service';
import { TeamStageTypeNewService } from '@services/new/team-stage-type-new.service';
import { NotificationsService } from 'angular2-notifications';
import { UtilsService } from '@services/utils.service';
import { pick, uniqBy } from 'lodash';
import { TeamStageState } from '@enums/team-stage-state.enum';

@Component({
   selector: 'app-team-stage-edit',
   templateUrl: './team-stage-edit.component.html',
   styleUrls: ['./team-stage-edit.component.scss']
})
export class TeamStageEditComponent implements OnInit {
   constructor(
      private activatedRoute: ActivatedRoute,
      private competitionService: CompetitionNewService,
      private notificationsService: NotificationsService,
      private teamStageService: TeamStageNewService,
      private teamStageTypeService: TeamStageTypeNewService,
      private router: Router
   ) {}

   public competitions: CompetitionNew[] = [];
   public teamStageForm: FormGroup;
   public teamStage: TeamStageNew;
   public teamStageTypes: TeamStageTypeNew[] = [];

   public ngOnInit(): void {
      this.getCompetitionsData();
      this.getTeamStageTypesData();
      this.getTeamStage(this.activatedRoute.snapshot.params.id);
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

      const teamStage = pick(this.teamStage, ['team_stage_type_id', 'competition_id', 'title', 'round', 'state']);
      this.updateTeamStage({ ...teamStage, ...this.teamStageForm.value });
   }

   public showFormErrorMessage(abstractControl: AbstractControl, errorKey: string): boolean {
      return UtilsService.showFormErrorMessage(abstractControl, errorKey);
   }

   public showFormInvalidClass(abstractControl: AbstractControl): boolean {
      return UtilsService.showFormInvalidClass(abstractControl);
   }

   private getCompetitionsData(): void {
      const search: CompetitionSearch = {
         page: 1,
         limit: SettingsService.maxLimitValues.competitions,
         states: [CompetitionState.NotStarted, CompetitionState.Applications, CompetitionState.Active],
         tournamentId: Tournament.Team
      };
      this.competitionService.getCompetitions(search).subscribe(response => {
         this.competitions = uniqBy(this.competitions.concat(response.data), 'id');
      });
   }

   private getTeamStage(id: number): void {
      this.teamStageService.getTeamStage(id, ['competition']).subscribe(response => {
         this.teamStage = response;
         this.handleTeamStageResponse(this.teamStage);
      });
   }

   private getTeamStageTypesData(): void {
      this.teamStageTypeService.getTeamStageTypes().subscribe(response => {
         this.teamStageTypes = response.data;
      });
   }

   private handleTeamStageResponse(teamStage: TeamStageNew): void {
      this.teamStageForm.patchValue(teamStage);
      if (teamStage.competition) {
         this.competitions = uniqBy(this.competitions.concat([teamStage.competition]), 'id');
      }
      switch (teamStage.state) {
         case TeamStageState.Ended:
            this.teamStageForm.disable();
            break;
         case TeamStageState.Active:
            this.teamStageForm.get('team_stage_type_id').disable();
            this.teamStageForm.get('competition_id').disable();
            this.teamStageForm.get('round').disable();
            break;
      }
   }

   private updateTeamStage(teamStage: Partial<TeamStageNew>): void {
      this.teamStageService.updateTeamStage(this.teamStage.id, teamStage).subscribe(response => {
         this.notificationsService.success('Успішно', `Командну стадію ${response.title} змінено`);
         this.router.navigate(['/manage', 'team', 'stages']);
      });
   }
}
