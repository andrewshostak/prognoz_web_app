import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { environment } from '@env';
import { TeamPrediction } from '@models/team/team-prediction.model';
import { TeamPredictionService } from '@services/team/team-prediction.service';
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
   @Output() public teamPredictionUpdated = new EventEmitter<any>();

   public clubsLogosPath: string = SettingsService.clubsLogosPath + '/';
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
         id: this.teamPrediction.id,
         team_match_id: this.teamPrediction.team_match_id,
         team_id: this.teamPrediction.team_id,
         home: this.teamPredictionUpdateForm.value.home,
         away: this.teamPredictionUpdateForm.value.away
      };

      this.teamPredictionService.updateTeamPrediction(teamPredictionToUpdate).subscribe(
         () => {
            this.spinnerButton = false;
            this.teamPredictionUpdated.emit();
            const message = `прогноз
                     ${this.teamPredictionUpdateForm.value.home}:${this.teamPredictionUpdateForm.value.away} на матч<br>
                     ${this.teamPrediction.team_match.club_first.title} - ${this.teamPrediction.team_match.club_second.title}`;
            this.notificationsService.success('Збережено', message);
         },
         errors => {
            this.spinnerButton = false;
            errors.forEach(error => this.notificationsService.error('Помилка', error));
         }
      );
   }
}
