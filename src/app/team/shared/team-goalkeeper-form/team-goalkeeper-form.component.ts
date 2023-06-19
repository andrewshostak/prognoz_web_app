import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

import { NotificationsService } from 'angular2-notifications';
import { TeamMatch } from '@models/v1/team-match.model';
import { TeamPredictionNewService } from '@services/v2/team-prediction-new.service';
import { User } from '@models/v2/user.model';

@Component({
   selector: 'app-team-goalkeeper-form',
   templateUrl: './team-goalkeeper-form.component.html',
   styleUrls: ['./team-goalkeeper-form.component.scss']
})
export class TeamGoalkeeperFormComponent implements OnChanges {
   @Input() teamMatches: { teamMatch: TeamMatch; isBlocked: boolean }[];
   @Input() properties: { blocksCount: number; currentTeamId: number; isGoalkeeper: boolean; teamTeamMatchId: number };
   @Input() authenticatedUser: User;

   isStageNotStarted: boolean = false;
   spinnerButton: boolean;
   teamGoalkeeperForm = new FormGroup({
      predictions: new FormArray([])
   });

   constructor(private notificationsService: NotificationsService, private teamPredictionService: TeamPredictionNewService) {}

   get numberOfCurrentlyBlocked(): number {
      return this.predictionsFormArray.controls.filter(control => control.value).length;
   }

   get predictionsFormArray(): FormArray {
      return this.teamGoalkeeperForm.controls.predictions as FormArray;
   }

   ngOnChanges(changes: SimpleChanges) {
      if (changes.teamMatches && changes.teamMatches.currentValue) {
         this.predictionsFormArray.clear();
         this.addCheckboxes(this.teamMatches);
         this.teamGoalkeeperForm.disable();
         this.isStageNotStarted = this.teamMatches.every(teamMatch => teamMatch.teamMatch.is_predictable);
      }

      if (this.properties && this.properties.isGoalkeeper && this.isStageNotStarted) {
         this.teamGoalkeeperForm.enable();
         this.updateDisabledStatus();
      }
   }

   onSubmit() {
      if (this.teamGoalkeeperForm.invalid) {
         return;
      }

      const predictions: { team_match_id: number }[] = this.predictionsFormArray.controls
         .map((control, i) => {
            return { team_match_id: control.value ? this.teamMatches[i].teamMatch.id : null };
         })
         .filter(value => !!value.team_match_id);
      const data = {
         predictions,
         team_id: this.properties.currentTeamId,
         team_team_match_id: this.properties.teamTeamMatchId
      };

      this.spinnerButton = true;
      this.teamPredictionService.updateBlock(data).subscribe(
         () => {
            this.spinnerButton = false;
            this.notificationsService.success('Успішно', 'Заблоковані матчі змінено');
         },
         () => (this.spinnerButton = false)
      );
   }

   updateDisabledStatus() {
      const currentlyBlocked = this.numberOfCurrentlyBlocked;
      // disable all checkboxes except checked
      if (currentlyBlocked === this.properties.blocksCount) {
         this.predictionsFormArray.controls.forEach((control, i) => {
            if (!control.value) {
               control.disable();
            }
         });
      }

      if (currentlyBlocked < this.properties.blocksCount) {
         this.predictionsFormArray.enable();
      }
   }

   private addCheckboxes(teamMatches: { teamMatch: TeamMatch; isBlocked: boolean }[]) {
      teamMatches.forEach(teamMatch => this.predictionsFormArray.push(new FormControl(teamMatch.isBlocked)));
   }
}
