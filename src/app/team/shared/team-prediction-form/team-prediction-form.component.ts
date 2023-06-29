import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { TeamPrediction } from '@models/v1/team-prediction.model';
import { TeamPredictionService } from '@services/v2/team/team-prediction.service';
import { UtilsService } from '@services/utils.service';
import { NotificationsService } from 'angular2-notifications';
import { SettingsService } from '@services/settings.service';

@Component({
   selector: 'app-team-prediction-form',
   templateUrl: './team-prediction-form.component.html',
   styleUrls: ['./team-prediction-form.component.scss']
})
export class TeamPredictionFormComponent implements OnInit {
   @Input() public teamPrediction: TeamPrediction;
   @Output() public teamPredictionUpdated = new EventEmitter<void>();

   public clubsLogosPath: string = SettingsService.imageBaseUrl.clubs;
   public isScore = UtilsService.isScore;
   public showScoresOrString = UtilsService.showScoresOrString;
   public spinnerButton: boolean;
   public teamPredictionUpdateForm: FormGroup;

   constructor(
      private formBuilder: FormBuilder,
      private notificationsService: NotificationsService,
      private teamPredictionService: TeamPredictionService
   ) {}

   public ngOnInit() {
      this.teamPredictionUpdateForm = new FormGroup({});
      if (!this.teamPrediction.team_match.is_predictable) {
         return;
      }

      this.teamPredictionUpdateForm = this.formBuilder.group({
         home: [this.teamPrediction.home, [Validators.required]],
         away: [this.teamPrediction.away, [Validators.required]]
      });
   }

   public onSubmit() {
      if (this.teamPredictionUpdateForm.invalid) {
         return;
      }

      this.spinnerButton = true;
      const teamPredictionToUpdate = {
         home: this.teamPredictionUpdateForm.value.home,
         away: this.teamPredictionUpdateForm.value.away
      };

      this.teamPredictionService.updatePrediction(this.teamPrediction.id, teamPredictionToUpdate).subscribe(
         () => {
            this.spinnerButton = false;
            this.teamPredictionUpdated.emit();
            const message = `прогноз
                     ${this.teamPredictionUpdateForm.value.home}:${this.teamPredictionUpdateForm.value.away} на матч<br>
                     ${this.teamPrediction.team_match.match.club_home.title} - ${this.teamPrediction.team_match.match.club_away.title}`;
            this.notificationsService.success('Збережено', message);
         },
         () => {
            this.spinnerButton = false;
         }
      );
   }
}
