import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { AuthService } from '@services/auth.service';
import { Competition } from '@models/competition.model';
import { CompetitionService } from '@services/competition.service';
import { CurrentStateService } from '@services/current-state.service';
import { environment } from '@env';
import { TeamTeamMatch } from '@models/team/team-team-match.model';
import { TeamTeamMatchService } from '@services/team/team-team-match.service';
import { TitleService } from '@services/title.service';
import { User } from '@models/user.model';

@Component({
    selector: 'app-team-matches',
    templateUrl: './team-matches.component.html',
    styleUrls: ['./team-matches.component.css']
})
export class TeamMatchesComponent implements OnInit, OnDestroy {
    constructor(
        private activatedRoute: ActivatedRoute,
        private authService: AuthService,
        private competitionService: CompetitionService,
        private currentStateService: CurrentStateService,
        private router: Router,
        private teamTeamMatchService: TeamTeamMatchService,
        private titleService: TitleService
    ) {}

    authenticatedUser: User = this.currentStateService.user;
    competition: Competition;
    errorCompetition: string;
    errorTeamTeamMatches: string;
    nextRound: string;
    previousRound: string;
    path = '/team/matches/round/';
    round: number;
    teamTeamMatches: TeamTeamMatch[];
    userSubscription: Subscription;

    ngOnDestroy() {
        if (!this.userSubscription.closed) {
            this.userSubscription.unsubscribe();
        }
    }

    ngOnInit() {
        this.userSubscription = this.authService.getUser.subscribe(response => {
            this.authenticatedUser = response;
        });

        this.activatedRoute.params.subscribe((params: Params) => {
            this.round = params['round'] || null;
            this.titleService.setTitle(`Матчі ${this.round ? this.round + ' туру' : 'поточного туру'} - Командний`);
            if (!params['round']) {
                this.getCompetitionData();
            } else {
                this.getTeamTeamMatchesData(params['round']);
            }
        });
    }

    getTeamTeamMatchesData(round: number) {
        this.teamTeamMatchService.getTeamTeamMatches(round).subscribe(
            response => {
                this.resetTeamTeamMatchData();
                if (response) {
                    this.teamTeamMatches = response.data;
                    this.nextRound = response.next_page_url;
                    this.previousRound = response.prev_page_url;
                }
            },
            error => {
                this.resetTeamTeamMatchData();
                this.errorTeamTeamMatches = error;
            }
        );
    }

    private getCompetitionData() {
        this.competitionService.getCompetitions(null, environment.tournaments.team.id, null, true).subscribe(
            response => {
                if (response) {
                    this.competition = response.competition;
                    if (this.competition.stated) {
                        this.router.navigate(['/team/squads']);
                    }
                    this.getTeamTeamMatchesData(response.competition.round);
                }
            },
            error => {
                this.errorCompetition = error;
            }
        );
    }

    private resetTeamTeamMatchData(): void {
        this.errorTeamTeamMatches = null;
        this.teamTeamMatches = null;
        this.nextRound = null;
        this.previousRound = null;
    }
}
