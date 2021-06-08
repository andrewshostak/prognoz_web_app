import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NotificationsService } from 'angular2-notifications';
import { TeamMatch } from '@models/team/team-match.model';
import { TeamPredictionService } from '@services/team/team-prediction.service';
import { User } from '@models/user.model';

@Component({
   selector: 'app-team-goalkeeper-form',
   templateUrl: './team-goalkeeper-form.component.html',
   styleUrls: ['./team-goalkeeper-form.component.scss']
})
export class TeamGoalkeeperFormComponent implements OnChanges {
   @Input() blockedTeamMatch: TeamMatch;
   @Input() teamMatches: TeamMatch[];
   @Input() oppositeTeamId: number;
   @Input() authenticatedUser: User;
   @Input() isGoalkeeper: boolean;
   @Output() reloadData = new EventEmitter<any>();

   public isStageStarted: boolean = false;
   public teamGoalkeeperForm: FormGroup = this.formBuilder.group({
      team_match_id: ['', [Validators.required]]
   });
   public spinnerButton: boolean;

   constructor(
      private formBuilder: FormBuilder,
      private notificationsService: NotificationsService,
      private teamPredictionService: TeamPredictionService
   ) {}

   matchHasPrediction(teamMatch: TeamMatch): boolean {
      return teamMatch.team_predictions && teamMatch.team_predictions[0];
   }

   ngOnChanges(changes: SimpleChanges) {
      for (const propName of Object.keys(changes)) {
         if (propName === 'blockedTeamMatch') {
            if (changes[propName].currentValue) {
               this.teamGoalkeeperForm.patchValue({ team_match_id: changes[propName].currentValue.id });
            }
         }
         if (propName === 'teamMatches') {
            if (changes[propName].currentValue) {
               this.isStageStarted = changes[propName].currentValue.some(teamMatch => !teamMatch.is_predictable);
            }
         }
      }
   }

   onSubmit() {
      if (this.teamGoalkeeperForm.valid) {
         this.spinnerButton = true;
         const selectedTeamMatch = this.teamMatches.find(teamMatch => {
            return teamMatch.id === parseInt(this.teamGoalkeeperForm.value.team_match_id, 10);
         });
         const teamPrediction = {
            id: this.matchHasPrediction(selectedTeamMatch) ? selectedTeamMatch.team_predictions[0].id : null,
            team_id: this.oppositeTeamId,
            team_match_id: selectedTeamMatch.id,
            blocked_by: this.authenticatedUser.id,
            unblock_id: this.blockedTeamMatch ? this.blockedTeamMatch.id : null
         };
         this.teamPredictionService.updateTeamPrediction(teamPrediction).subscribe(
            () => {
               this.notificationsService.success(
                  'Успішно',
                  `Матч ${selectedTeamMatch.club_first.title} - ${selectedTeamMatch.club_second.title} заблоковано`
               );
               this.reloadData.emit();
               this.spinnerButton = false;
            },
            errors => {
               errors.forEach(error => this.notificationsService.error('Помилка', error));
               this.reloadData.emit();
               this.spinnerButton = false;
            }
         );
      }
   }
}
