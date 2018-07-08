import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { environment } from '@env';
import { HelperService } from '../../../core/services/helper.service';
import { NotificationsService } from 'angular2-notifications';
import { TeamPrediction } from '../../../shared/models/team/team-prediction.model';
import { TeamPredictionService } from '../../../core/services/team/team-prediction.service';

@Component({
    selector: 'app-team-prediction-form',
    templateUrl: './team-prediction-form.component.html',
    styleUrls: ['./team-prediction-form.component.css']
})
export class TeamPredictionFormComponent implements OnInit {
    @Input() teamPrediction: TeamPrediction;
    @Output() teamPredictionUpdated = new EventEmitter<any>();

    clubsImagesUrl: string = environment.apiImageClubs;
    teamPredictionUpdateForm: FormGroup;
    spinnerButton: boolean;

    constructor(
        public helperService: HelperService,
        private formBuilder: FormBuilder,
        private notificationService: NotificationsService,
        private teamPredictionService: TeamPredictionService
    ) {}

    ngOnInit() {
        this.teamPredictionUpdateForm = new FormGroup({});
        if (this.teamPrediction.team_match.is_predictable) {
            this.teamPredictionUpdateForm = this.formBuilder.group({
                home: [this.teamPrediction.home, [Validators.required]],
                away: [this.teamPrediction.away, [Validators.required]]
            });
        }
    }

    onSubmit() {
        if (this.teamPredictionUpdateForm.valid) {
            this.spinnerButton = true;
            const teamPredictionToUpdate = {
                id: this.teamPrediction.id,
                team_match_id: this.teamPrediction.team_match_id,
                team_id: this.teamPrediction.team_id,
                home: this.teamPredictionUpdateForm.value.home,
                away: this.teamPredictionUpdateForm.value.away
            };
            this.teamPredictionService.updateTeamPrediction(teamPredictionToUpdate).subscribe(
                response => {
                    this.teamPredictionUpdated.emit();
                    this.notificationService.success('Успішно', 'Прогноз прийнято');
                    this.spinnerButton = false;
                },
                errors => {
                    errors.forEach(error => this.notificationService.error('Помилка', error));
                    this.spinnerButton = false;
                }
            );
        }
    }
}
