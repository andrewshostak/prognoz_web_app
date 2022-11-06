import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

import { TeamStageState } from '@enums/team-stage-state.enum';
import { TeamStageType } from '@enums/team-stage-type.enum';
import { GenerateTeamTeamMatchesNew } from '@models/new/generate-team-team-matches-new.model';
import { TeamStageNew } from '@models/new/team-stage-new.model';
import { TeamStageSearch } from '@models/search/team-stage-search.model';
import { TeamStageNewService } from '@services/new/team-stage-new.service';
import { TeamTeamMatchNewService } from '@services/new/team-team-match-new.service';
import { SettingsService } from '@services/settings.service';
import { UtilsService } from '@services/utils.service';
import { NotificationsService } from 'angular2-notifications';
import { times } from 'lodash';

@Component({
   selector: 'app-team-team-match-generation-modal',
   templateUrl: './team-team-match-generation-modal.component.html'
})
export class TeamTeamMatchGenerationModalComponent implements OnInit {
   @Input() public close: () => void;
   @Output() public successfullySubmitted = new EventEmitter<void>();

   public generationForm: FormGroup;
   public teamStages: TeamStageNew[] = [];
   public spinnerButton = false;
   public numberOfTeamsInPot: number = 0;

   constructor(
      private notificationsService: NotificationsService,
      private teamStageService: TeamStageNewService,
      private teamTeamMatchService: TeamTeamMatchNewService
   ) {}

   get pots(): FormArray {
      return this.generationForm.get('pots_team_ids') as FormArray;
   }

   public getTeamIds(potIndex: number): FormArray {
      return this.pots.at(potIndex).get('team_ids') as FormArray;
   }

   public addPot(): void {
      this.pots.push(
         new FormGroup({
            team_ids: new FormArray([])
         })
      );

      times(this.numberOfTeamsInPot, () => {
         this.getTeamIds(this.pots.length - 1).push(
            new FormGroup({
               team_id: new FormControl(null, [Validators.required])
            })
         );
      });
   }

   public addTeam(): void {
      this.pots.controls.forEach((control, i) => {
         this.getTeamIds(i).push(
            new FormGroup({
               team_id: new FormControl(null, [Validators.required])
            })
         );
      });
      this.numberOfTeamsInPot++;
   }

   public removePot(): void {
      this.pots.removeAt(this.pots.length - 1);
   }

   public removeTeam(): void {
      this.pots.controls.forEach((control, i) => {
         const length = this.getTeamIds(i).length;
         this.getTeamIds(i).removeAt(length - 1);
      });
      this.numberOfTeamsInPot--;
   }

   public isTeamCupGroupStage(teamStageId: number): boolean {
      const stage = this.teamStages.find(teamStage => teamStage.id === teamStageId);
      if (!stage) {
         return false;
      }

      return stage.team_stage_type.id === TeamStageType.CupGroupRound;
   }

   public ngOnInit(): void {
      this.getTeamStagesData();
      this.generationForm = new FormGroup({
         team_stage_id: new FormControl(null, [Validators.required])
      });
      this.subscribeToTeamStageChanges();
   }

   public submit(): void {
      if (this.generationForm.invalid) {
         return;
      }

      this.spinnerButton = true;
      const toGenerate: GenerateTeamTeamMatchesNew = {
         team_stage_id: this.generationForm.get('team_stage_id').value
      };
      if (this.isTeamCupGroupStage(this.generationForm.get('team_stage_id').value)) {
         toGenerate.pots_team_ids = this.mapPots();
      }
      this.teamTeamMatchService.generateTeamTeamMatches(toGenerate).subscribe(
         value => {
            this.spinnerButton = false;
            this.notificationsService.success('Успішно', 'Кількість створених матчів: ' + value);
            this.successfullySubmitted.emit();
         },
         () => (this.spinnerButton = false)
      );
   }

   public showFormErrorMessage(abstractControl: AbstractControl, errorKey: string): boolean {
      return UtilsService.showFormErrorMessage(abstractControl, errorKey);
   }

   public showFormInvalidClass(abstractControl: AbstractControl): boolean {
      return UtilsService.showFormInvalidClass(abstractControl);
   }

   private getTeamStagesData(): void {
      const search: TeamStageSearch = {
         page: 1,
         limit: SettingsService.maxLimitValues.teamStages,
         states: [TeamStageState.NotStarted],
         relations: ['teamStageType', 'competition']
      };
      this.teamStageService.getTeamStages(search).subscribe(response => {
         this.teamStages = response.data;
      });
   }
   z;
   private mapPots(): number[][] {
      const potsTeamIds: number[][] = [];
      this.pots.controls.forEach((control, i) => {
         const teamIds = [];
         this.getTeamIds(i).controls.forEach(c => {
            teamIds.push(c.get('team_id').value);
         });
         potsTeamIds.push(teamIds);
      });
      return potsTeamIds;
   }

   private subscribeToTeamStageChanges(): void {
      this.generationForm.get('team_stage_id').valueChanges.subscribe(id => {
         if (this.isTeamCupGroupStage(id)) {
            this.generationForm.addControl('pots_team_ids', new FormArray([]));
         } else {
            this.generationForm.removeControl('pots_team_ids');
         }
      });
   }
}
