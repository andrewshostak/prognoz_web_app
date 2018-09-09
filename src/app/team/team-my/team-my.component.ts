import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { AuthService } from '@services/auth.service';
import { CurrentStateService } from '@services/current-state.service';
import { NotificationsService } from 'angular2-notifications';
import { RequestParams } from '@models/request-params.model';
import { Team } from '@models/team/team.model';
import { TeamMatch } from '@models/team/team-match.model';
import { TeamMatchService } from '@services/team/team-match.service';
import { TeamService } from '@services/team/team.service';
import { TeamTeamMatch } from '@models/team/team-team-match.model';
import { TeamTeamMatchService } from '@services/team/team-team-match.service';
import { TitleService } from '@services/title.service';
import { User } from '@models/user.model';

declare var $: any;

@Component({
    selector: 'app-team-my',
    templateUrl: './team-my.component.html',
    styleUrls: ['./team-my.component.scss']
})
export class TeamMyComponent implements OnInit, OnDestroy {
    constructor(
        private authService: AuthService,
        private currentStateService: CurrentStateService,
        private notificationsService: NotificationsService,
        private router: Router,
        private teamMatchService: TeamMatchService,
        private teamService: TeamService,
        private teamTeamMatchService: TeamTeamMatchService,
        private titleService: TitleService
    ) {
        this.subscribeToRouterEvents();
    }

    authenticatedUser: User = this.currentStateService.user;
    competitionId: number;
    errorTeam: string;
    errorTeamMatches: string;
    errorTeamTeamMatches: string;
    isCaptain = false;
    nextRound: string;
    noAccess = 'Доступ заборонено. Увійдіть на сайт для перегляду цієї сторінки.';
    path: string;
    previousRound: string;
    routerEventsSubscription: Subscription;
    round: number;
    spinnerButtonTeamEditForm = false;
    team: Team;
    teamEditForm: FormGroup;
    teamEditFormHasUnsavedChanges = false;
    teamMatches: TeamMatch[];
    teamTeamMatches: TeamTeamMatch[];
    userSubscription: Subscription;

    getTeamTeamMatchesData(competitionId: number, round?: number) {
        const params: RequestParams[] = [{ parameter: 'competition_id', value: this.competitionId.toString() }];
        if (round) {
            params.push({ parameter: 'page', value: round.toString() });
        }
        this.teamTeamMatchService.getTeamTeamMatches(params).subscribe(
            response => {
                this.errorTeamTeamMatches = null;
                if (!response) {
                    this.previousRound = null;
                    this.nextRound = null;
                    this.teamTeamMatches = null;
                    return;
                }
                this.teamTeamMatches = response.data;
                this.nextRound = response.next_page_url;
                this.previousRound = response.prev_page_url;
            },
            error => {
                this.errorTeamTeamMatches = error;
                this.teamTeamMatches = null;
                this.nextRound = null;
                this.previousRound = null;
            }
        );
    }

    ngOnDestroy() {
        if (!this.routerEventsSubscription.closed) {
            this.routerEventsSubscription.unsubscribe();
        }
        if (!this.userSubscription.closed) {
            this.userSubscription.unsubscribe();
        }
    }

    ngOnInit() {
        this.titleService.setTitle('Вибір статегії і воротаря - Командний');
        this.userSubscription = this.authService.getUser.subscribe(response => {
            this.authenticatedUser = response;
            if (response && this.competitionId) {
                this.getTeamData(this.competitionId);
                this.getTeamTeamMatchesData(this.competitionId, this.round);
            } else {
                this.isCaptain = false;
            }
        });

        this.teamEditForm = new FormGroup({
            name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]),
            image: new FormControl(null, []),
            caption: new FormControl(null, [Validators.maxLength(140)]),
            club_id: new FormControl(null, [])
        });
    }

    onSubmitted(teamEditForm: FormGroup) {
        if (teamEditForm.valid) {
            this.spinnerButtonTeamEditForm = true;
            teamEditForm.value.id = this.team.id;
            this.teamService.updateTeam(teamEditForm.value).subscribe(
                response => {
                    if (response) {
                        this.team = Object.assign({}, response);
                    }
                    $('#teamEditModal').modal('hide');
                    this.notificationsService.success('Успішно', 'Команду редаговано');
                    this.spinnerButtonTeamEditForm = false;
                    this.teamEditFormHasUnsavedChanges = false;
                },
                errors => {
                    errors.forEach(error => this.notificationsService.error('Помилка', error));
                    this.spinnerButtonTeamEditForm = false;
                    this.teamEditFormHasUnsavedChanges = false;
                }
            );
        }
    }

    private getTeamData(competitionId: number) {
        const params = [
            { parameter: 'user_id', value: this.authenticatedUser.id.toString() },
            { parameter: 'competition_id', value: competitionId.toString() }
        ];
        this.teamService.getTeam(null, params).subscribe(
            response => {
                this.errorTeam = null;
                if (!response) {
                    this.team = null;
                    return;
                }

                this.team = Object.assign({}, response);
                if (this.team.captain_id !== this.authenticatedUser.id) {
                    return;
                }

                this.isCaptain = true;
                this.teamEditForm.patchValue({
                    name: this.team.name,
                    caption: this.team.caption,
                    club_id: this.team.club_id,
                    image: null
                });
            },
            error => {
                this.errorTeam = error;
                this.team = null;
            }
        );
    }

    private setPath(competitionId: number): void {
        this.path = `/team/competitions/${competitionId}/my/round/`;
    }

    private subscribeToRouterEvents(): void {
        this.routerEventsSubscription = this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                this.urlChanged(event.url);
            }
        });
    }

    private urlChanged(url: string): void {
        const urlAsArray = url.split('/');

        const temporaryCompetitionsIndex = urlAsArray.findIndex(item => item === 'competitions');
        if (temporaryCompetitionsIndex > -1) {
            this.competitionId = parseInt(urlAsArray[temporaryCompetitionsIndex + 1], 10);
        }

        const temporaryRoundIndex = urlAsArray.findIndex(item => item === 'round');
        if (temporaryRoundIndex > -1) {
            this.round = parseInt(urlAsArray[temporaryRoundIndex + 1], 10);
        }

        if (!this.competitionId) {
            return;
        }

        this.setPath(this.competitionId);

        if (!this.authenticatedUser) {
            return;
        }

        this.getTeamData(this.competitionId);
        this.getTeamTeamMatchesData(this.competitionId, this.round);
    }
}
