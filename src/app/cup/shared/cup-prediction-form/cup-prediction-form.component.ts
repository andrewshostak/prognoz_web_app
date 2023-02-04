import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { CupMatch } from '@models/cup/cup-match.model';
import { CupPredictionNew } from '@models/new/cup-prediction-new.model';
import { User } from '@models/user.model';
import { CupPredictionNewService } from '@services/new/cup-prediction-new.service';
import { UtilsService } from '@services/utils.service';
import { NotificationsService } from 'angular2-notifications';
import { SettingsService } from '@services/settings.service';

@Component({
   selector: 'app-cup-prediction-form',
   templateUrl: './cup-prediction-form.component.html',
   styleUrls: ['./cup-prediction-form.component.scss']
})
export class CupPredictionFormComponent implements OnInit {
   public clubsLogosPath: string = SettingsService.clubsLogosPath + '/';
   public cupPredictionForm: FormGroup;
   public spinnerButton: boolean;
   public cupPrediction: CupPredictionNew;
   public isScore = UtilsService.isScore;

   @Input() public authenticatedUser: User;
   @Input() public cupMatch: CupMatch;
   @Output() public cupPredictionUpdated = new EventEmitter<{ cupMatchId: number; cupPrediction?: CupPredictionNew; errors?: string[] }>();

   constructor(private cupPredictionService: CupPredictionNewService, private notificationsService: NotificationsService) {}

   public ngOnInit() {
      this.cupPrediction = this.cupMatch.cup_predictions[0] || {
         user_id: this.authenticatedUser.id,
         home: null,
         away: null,
         cup_match_id: this.cupMatch.id,
         cup_cup_match_id: this.cupMatch.cup_stages[0].cup_cup_matches[0].id
      };
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

   public onSubmit() {
      if (this.cupPredictionForm.invalid) {
         return;
      }

      this.spinnerButton = true;
      const cupPredictionToUpdate = Object.assign({}, this.cupPrediction);
      cupPredictionToUpdate.home = this.cupPredictionForm.get('home').value;
      cupPredictionToUpdate.away = this.cupPredictionForm.get('away').value;

      this.cupPredictionService.upsertPrediction(cupPredictionToUpdate).subscribe(
         response => {
            this.spinnerButton = false;
            this.cupPredictionUpdated.emit({
               cupMatchId: this.cupMatch.id,
               cupPrediction: response
            });
            const message = `прогноз
               ${cupPredictionToUpdate.home}:${cupPredictionToUpdate.away} на матч<br>
               ${this.cupMatch.club_first.title} - ${this.cupMatch.club_second.title}`;
            this.notificationsService.success('Збережено', message);
         },
         errors => {
            this.spinnerButton = false;
            this.cupPredictionUpdated.emit({
               cupMatchId: this.cupMatch.id,
               cupPrediction: null,
               errors
            });
            errors.forEach(error => this.notificationsService.error('Помилка', error));
         }
      );
   }
}
