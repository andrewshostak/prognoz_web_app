import { Location }                                         from '@angular/common';
import { Component, OnInit }                                from '@angular/core';
import { ActivatedRoute, Params, Router }                   from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators }  from '@angular/forms';

import { Competition }                                      from '../../../shared/models/competition.model';
import { CompetitionService }                               from '../../../core/competition.service';
import { environment }                                      from '../../../../environments/environment';
import { NotificationsService }                             from 'angular2-notifications';
import { Season }                                           from '../../../shared/models/season.model';
import { SeasonService }                                    from '../../../core/season.service';
import { Tournament }                                       from '../../../shared/models/tournament.model';
import { TournamentService }                                from '../../../core/tournament.service';


@Component({
  selector: 'app-competition-edit',
  templateUrl: './competition-edit.component.html',
  styleUrls: ['./competition-edit.component.css']
})
export class CompetitionEditComponent implements OnInit {

    constructor(
        private activatedRoute: ActivatedRoute,
        private competitionService: CompetitionService,
        private formBuilder: FormBuilder,
        private location: Location,
        private notificationService: NotificationsService,
        private seasonService: SeasonService,
        private tournamentService: TournamentService
    ) { }

    competition: Competition;
    competitionEditForm: FormGroup;
    competitionsEnvironment = environment.tournaments;
    errorCompetition: string;
    errorSeasons: string;
    errorTournaments: string;
    noSeasons: string = 'В базі даних сезонів не знайдено.';
    noTournaments: string;
    seasons: Season[];
    spinnerButton: boolean = false;
    tournaments: Tournament[];

    ngOnInit() {
        this.competitionEditForm = this.formBuilder.group({
            id: ['', [Validators.required]],
            title: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(50)]],
            season_id: ['', [Validators.required]],
            tournament_id: ['', [Validators.required]],
            number_of_teams: ['', [this.validateNumberOfTeams]],
            stated: ['', [Validators.required]],
            active: ['', [Validators.required]],
            ended: ['', [Validators.required]]
        });
        this.activatedRoute.params.forEach((params: Params) => {
            this.getCompetitionData(params['id']);
        });
        this.getSeasonsData();
        this.getTournamentsData();
    }

    onSubmit() {
        this.spinnerButton = true;
        this.competitionService.updateCompetition(this.competitionEditForm.value)
            .subscribe(
                response => {
                    this.notificationService.success('Успішно', 'Змагання змінено');
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

    private getCompetitionData(id: number) {
        this.competitionService.getCompetition(id).subscribe(
            response => {
                this.competition = response;
                this.updateCompetitionEditForm(response);
            },
            error => {
                this.errorCompetition = error;
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

    private updateCompetitionEditForm(competition: Competition) {
        this.competitionEditForm.patchValue({
            id: competition.id,
            title: competition.title,
            season_id: competition.season_id,
            tournament_id: competition.tournament_id,
            number_of_teams: competition.number_of_teams,
            stated: competition.stated,
            active: competition.active,
            ended: competition.ended
        });
    }
}
