import { Location } from '@angular/common';
import { Component, Input, OnInit, SimpleChanges, OnChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Competition } from '@models/competition.model';
import { CompetitionService } from '@services/competition.service';
import { FormValidatorService } from '@services/form-validator.service';
import { NotificationsService } from 'angular2-notifications';
import { Season } from '@models/season.model';
import { SeasonService } from '@services/season.service';
import { Tournament } from '@models/tournament.model';
import { TournamentService } from '@services/tournament.service';
import { UtilsService } from '@services/utils.service';

@Component({
    selector: 'app-competition-form',
    templateUrl: './competition-form.component.html',
    styleUrls: ['./competition-form.component.scss']
})
export class CompetitionFormComponent implements OnChanges, OnInit {
    constructor(
        private competitionService: CompetitionService,
        private location: Location,
        private notificationsService: NotificationsService,
        private seasonService: SeasonService,
        private tournamentService: TournamentService,
        private formValidatorService: FormValidatorService
    ) {}

    @Input() competition: Competition;

    competitionForm: FormGroup;
    errorSeasons: string;
    errorTournaments: string;
    seasons: Season[];
    tournaments: Tournament[];

    createCompetition(competition: Competition): void {
        this.competitionService.createCompetition(competition).subscribe(
            response => {
                this.notificationsService.success('Успішно', 'Змагання створено');
                this.location.back();
            },
            errors => {
                errors.forEach(error => this.notificationsService.error('Помилка', error));
            }
        );
    }

    ngOnChanges(simpleChanges: SimpleChanges) {
        UtilsService.patchSimpleChangeValuesInForm(simpleChanges, this.competitionForm, 'competition');
    }

    ngOnInit() {
        this.getSeasonsData();
        this.getTournamentsData();
        this.competitionForm = new FormGroup({
            title: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(50)]),
            season_id: new FormControl('', [Validators.required]),
            tournament_id: new FormControl('', [Validators.required]),
            stated: new FormControl(false),
            active: new FormControl(false),
            ended: new FormControl(false),
            participants: new FormControl(null, [this.formValidatorService.parity()]),
            players_in_group: new FormControl(null, [this.formValidatorService.parity()]),
            first_playoff_stage: new FormControl(null, [this.formValidatorService.parity()]),
            number_of_teams: new FormControl(null, [this.formValidatorService.parity()])
        });
    }

    onSubmit(): void {
        if (this.competitionForm.valid) {
            this.competition ? this.updateCompetition(this.competitionForm.value) : this.createCompetition(this.competitionForm.value);
        }
    }

    updateCompetition(competition: Competition): void {
        this.competitionService.updateCompetition(competition, this.competition.id).subscribe(
            response => {
                this.notificationsService.success('Успішно', 'Змагання змінено');
                this.location.back();
            },
            errors => {
                errors.forEach(error => this.notificationsService.error('Помилка', error));
            }
        );
    }

    private getSeasonsData() {
        this.seasonService.getSeasons().subscribe(
            response => {
                if (response) {
                    this.seasons = response.seasons;
                }
            },
            error => {
                this.errorSeasons = error;
            }
        );
    }

    private getTournamentsData() {
        this.tournamentService.getTournaments().subscribe(
            response => {
                if (response) {
                    this.tournaments = response.tournaments;
                }
            },
            error => {
                this.errorTournaments = error;
            }
        );
    }
}
