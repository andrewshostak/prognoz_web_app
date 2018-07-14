import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { CupMatch } from '@models/cup/cup-match.model';
import { CupPrediction } from '@models/cup/cup-prediction.model';
import { CupPredictionService } from '@services/cup/cup-prediction.service';
import { environment } from '@env';
import { NotificationsService } from 'angular2-notifications';
import { User } from '@models/user.model';
import { UtilsService } from '@services/utils.service';

@Component({
    selector: 'app-cup-prediction-form',
    templateUrl: './cup-prediction-form.component.html',
    styleUrls: ['./cup-prediction-form.component.scss']
})
export class CupPredictionFormComponent implements OnInit {
    constructor(private cupPredictionService: CupPredictionService, private notificationsService: NotificationsService) {}

    clubsImagesUrl: string = environment.apiImageClubs;
    cupPredictionForm: FormGroup;
    spinnerButton: boolean;
    cupPrediction: CupPrediction;
    isScore = UtilsService.isScore;

    @Input() authenticatedUser: User;
    @Input() cupMatch: CupMatch;
    @Output() cupPredictionUpdated = new EventEmitter<{ cupMatchId: number; cupPrediction?: CupPrediction; errors?: string[] }>();

    ngOnInit() {
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

    onSubmit() {
        if (this.cupPredictionForm.valid) {
            this.spinnerButton = true;
            const cupPredictionToUpdate = Object.assign({}, this.cupPrediction);
            cupPredictionToUpdate.home = this.cupPredictionForm.get('home').value;
            cupPredictionToUpdate.away = this.cupPredictionForm.get('away').value;
            this.cupPredictionService.updateCupPrediction(cupPredictionToUpdate).subscribe(
                response => {
                    this.cupPredictionUpdated.emit({
                        cupMatchId: this.cupMatch.id,
                        cupPrediction: response
                    });
                    this.notificationsService.success('Успішно', 'Прогноз прийнято');
                    this.spinnerButton = false;
                },
                errors => {
                    this.cupPredictionUpdated.emit({
                        cupMatchId: this.cupMatch.id,
                        cupPrediction: null,
                        errors: errors
                    });
                    errors.forEach(error => this.notificationsService.error('Помилка', error));
                    this.spinnerButton = false;
                }
            );
        }
    }
}
