import { Location }                                             from '@angular/common';
import { Component, Input, OnInit, SimpleChanges, OnChanges }   from '@angular/core';
import { FormControl, FormGroup, Validators }                   from '@angular/forms';

import { Competition }                                          from '../../../../shared/models/competition.model';
import { CompetitionService }                                   from '../../../../core/competition.service';
import { NotificationsService }                                 from 'angular2-notifications';
import { patchSimpleChangeValuesInForm }                        from '@utils/patch-simple-change-values-in-form';
import { Season }                                               from '../../../../shared/models/season.model';
import { SeasonService }                                        from '../../../../core/season.service';
import { Tournament }                                           from '../../../../shared/models/tournament.model';
import { TournamentService }                                    from 'app/core/tournament.service';
import { ValidatorService }                                     from '../../../../core/services/validator.service';

@Component({
  selector: 'app-competition-form',
  templateUrl: './competition-form.component.html',
  styleUrls: ['./competition-form.component.css']
})
export class CompetitionFormComponent implements OnChanges, OnInit {

    constructor(
        private competitionService: CompetitionService,
        private location: Location,
        private notificationsService: NotificationsService,
        private seasonService: SeasonService,
        private tournamentService: TournamentService,
        private validatorService: ValidatorService,
    ) { }

    @Input() competition: Competition;

    competitionForm: FormGroup;
    errorSeasons: string;
    errorTournaments: string;
    seasons: Season[];
    tournaments: Tournament[];

    createCompetition(competition: Competition): void {
        this.competitionService
            .createCompetition(competition)
            .subscribe(
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
        patchSimpleChangeValuesInForm(
            simpleChanges,
            this.competitionForm,
            'competition'
        );
    }

    ngOnInit() {
        this.getSeasonsData();
        this.getTournamentsData();
        this.competitionForm = new FormGroup({
            title: new FormControl('', [
                Validators.required,
                Validators.minLength(10),
                Validators.maxLength(50)
            ]),
            season_id: new FormControl('', [Validators.required]),
            tournament_id: new FormControl('', [Validators.required]),
            stated: new FormControl(false),
            active: new FormControl(false),
            ended: new FormControl(false),
            participants: new FormControl(null, [this.validatorService.parity()]),
            players_in_group: new FormControl(null, [this.validatorService.parity()]),
            first_playoff_stage: new FormControl(null, [this.validatorService.parity()]),
            number_of_teams: new FormControl(null, [this.validatorService.parity()]),
        });
    }

    onSubmit(): void {
        if (this.competitionForm.valid) {
            this.competition
                ? this.updateCompetition(this.competitionForm.value)
                : this.createCompetition(this.competitionForm.value);
        }
    }

    updateCompetition(competition: Competition): void {
        this.competitionService
            .updateCompetition(competition, this.competition.id)
            .subscribe(
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
