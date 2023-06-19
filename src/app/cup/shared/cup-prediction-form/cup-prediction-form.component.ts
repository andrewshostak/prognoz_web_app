import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { CupPrediction } from '@models/v2/cup/cup-prediction.model';
import { User } from '@models/v2/user.model';
import { CupPredictionService } from '@services/v2/cup/cup-prediction.service';
import { SettingsService } from '@services/settings.service';
import { UtilsService } from '@services/utils.service';
import { NotificationsService } from 'angular2-notifications';

@Component({
   selector: 'app-cup-prediction-form',
   templateUrl: './cup-prediction-form.component.html',
   styleUrls: ['./cup-prediction-form.component.scss']
})
export class CupPredictionFormComponent implements OnInit {
   constructor(private cupPredictionService: CupPredictionService, private notificationsService: NotificationsService) {}

   clubsLogosPath: string = SettingsService.clubsLogosPath + '/';
   cupPredictionForm: FormGroup;
   spinnerButton: boolean;
   isScore: boolean;

   @Input() authenticatedUser: User;
   @Input() cupPrediction: CupPrediction;
   @Output() cupPredictionUpdated = new EventEmitter<{
      cupMatchId: number;
      cupPrediction?: CupPrediction;
      error?: { message: string; status_code: number };
   }>();

   ngOnInit() {
      this.isScore = UtilsService.isScore(this.cupPrediction.home, this.cupPrediction.away);
      this.cupPredictionForm = new FormGroup({
         home: new FormControl(this.cupPrediction.home, [
            Validators.required,
            Validators.maxLength(1),
            Validators.min(0),
            Validators.max(9)
         ]),
         away: new FormControl(this.cupPrediction.away, [
            Validators.required,
            Validators.maxLength(1),
            Validators.min(0),
            Validators.max(9)
         ])
      });
   }

   onSubmit() {
      if (this.cupPredictionForm.invalid) {
         return;
      }

      this.spinnerButton = true;
      const cupPredictionToUpdate = {
         user_id: this.authenticatedUser.id,
         cup_match_id: this.cupPrediction.cup_match_id,
         cup_cup_match_id: this.cupPrediction.cup_cup_match_id
      } as Partial<CupPrediction>;
      cupPredictionToUpdate.home = this.cupPredictionForm.get('home').value;
      cupPredictionToUpdate.away = this.cupPredictionForm.get('away').value;

      this.cupPredictionService.upsertPrediction(cupPredictionToUpdate).subscribe(
         response => {
            this.spinnerButton = false;
            this.cupPredictionUpdated.emit({ cupMatchId: cupPredictionToUpdate.cup_match_id, cupPrediction: response });
            const message = `прогноз
               ${cupPredictionToUpdate.home}:${cupPredictionToUpdate.away} на матч<br>
               ${this.cupPrediction.cup_match.match.club_home.title} - ${this.cupPrediction.cup_match.match.club_away.title}`;
            this.notificationsService.success('Збережено', message);
            this.isScore = UtilsService.isScore(response.home, response.away);
         },
         error => {
            this.spinnerButton = false;
            this.cupPredictionUpdated.emit({ cupMatchId: cupPredictionToUpdate.cup_match_id, error: error.error });
         }
      );
   }
}
