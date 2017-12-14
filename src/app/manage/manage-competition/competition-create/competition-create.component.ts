import { Location }                             from '@angular/common';
import { Component, OnInit }                    from '@angular/core';
import { FormControl, FormGroup, Validators }   from '@angular/forms';

import { CompetitionService }                   from '../../../core/competition.service';
import { environment }                          from '../../../../environments/environment';
import { NotificationsService }                 from 'angular2-notifications';
import { Season }                               from '../../../shared/models/season.model';
import { SeasonService }                        from '../../../core/season.service';
import { Tournament }                           from '../../../shared/models/tournament.model';
import { TournamentService }                    from '../../../core/tournament.service';

@Component({
  selector: 'app-competition-create',
  templateUrl: './competition-create.component.html',
  styleUrls: ['./competition-create.component.css']
})
export class CompetitionCreateComponent implements OnInit {

    constructor(
        private competitionService: CompetitionService,
        private location: Location,
        private notificationService: NotificationsService,
        private seasonService: SeasonService,
        private tournamentService: TournamentService
    ) { }

    competitionCreateForm: FormGroup;
    competitionsEnvironment = environment.tournaments;
    errorSeasons: string;
    errorTournaments: string;
    noSeasons: string = 'В базі даних сезонів не знайдено.';
    noTournaments: string;
    seasons: Season[];
    spinnerButton: boolean = false;
    tournaments: Tournament[];

    ngOnInit() {
        this.getSeasonsData();
        this.getTournamentsData();
        this.competitionCreateForm = new FormGroup({
            title: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(50)]),
            season_id: new FormControl('', [Validators.required]),
            tournament_id: new FormControl('', [Validators.required]),
            number_of_teams: new FormControl('', [this.validateNumberOfTeams])
        });
    }

    onSubmit() {
        this.spinnerButton = true;
        this.competitionService.createCompetition(this.competitionCreateForm.value).subscribe(
            response => {
                this.notificationService.success('Успішно', 'Змагання створено');
                this.spinnerButton = false;
                this.location.back();
            },
            errors => {
                errors.forEach(error => this.notificationService.error('Помилка', error));
                this.spinnerButton = false;
            }
        );
    }

    validateNumberOfTeams(numberOfTeams: FormControl) {
        return (numberOfTeams.value % 2 === 0) ? null : {
            parity: {
                valid: false
            }
        };
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
                if (!response) {
                    this.noTournaments = 'В базі даних турнірів не знайдено.'
                } else {
                    this.tournaments = response.tournaments;
                }
            },
            error => {
                this.errorTournaments = error;
            }
        );
    }
}
