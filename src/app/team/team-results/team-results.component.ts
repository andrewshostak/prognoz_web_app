import { Component, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { RequestParams } from '@models/request-params.model';
import { Subscription } from 'rxjs/Subscription';
import { TeamMatch } from '@models/team/team-match.model';
import { TeamMatchService } from '@services/team/team-match.service';
import { TitleService } from '@services/title.service';

@Component({
    selector: 'app-team-results',
    templateUrl: './team-results.component.html',
    styleUrls: ['./team-results.component.scss']
})
export class TeamResultsComponent implements OnDestroy {
    constructor(private router: Router, private titleService: TitleService, private teamMatchService: TeamMatchService) {
        this.subscribeToRouterEvents();
    }

    competitionId: number;
    errorTeamMatches: string;
    nextRound: string;
    path: string;
    previousRound: string;
    round: number;
    routerEventsSubscription: Subscription;
    teamMatches: TeamMatch[];

    getTeamMatchesData(competitionId: number, round?: number) {
        const params: RequestParams[] = [
            { parameter: 'filter', value: 'round' },
            { parameter: 'competition_id', value: competitionId.toString() }
        ];
        if (round) {
            params.push({ parameter: 'page', value: round.toString() });
        }
        this.teamMatchService.getTeamMatches(params).subscribe(
            response => {
                if (response) {
                    this.teamMatches = response.data;
                    this.nextRound = response.next_page_url;
                    this.previousRound = response.prev_page_url;
                }
                this.errorTeamMatches = null;
            },
            error => {
                this.errorTeamMatches = error;
                this.teamMatches = null;
            }
        );
    }

    ngOnDestroy() {
        if (!this.routerEventsSubscription.closed) {
            this.routerEventsSubscription.unsubscribe();
        }
    }

    private setPageTitle(): void {
        this.titleService.setTitle(`Результати ${this.round ? this.round + ' туру' : 'поточного туру'} - Командний`);
    }

    private setPath(competitionId: number): void {
        this.path = `/team/competitions/${competitionId}/results/round/`;
    }

    private subscribeToRouterEvents(): void {
        this.routerEventsSubscription = this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                const urlAsArray = event.url.split('/');

                const temporaryCompetitionsIndex = urlAsArray.findIndex(item => item === 'competitions');
                if (temporaryCompetitionsIndex > -1) {
                    this.competitionId = parseInt(urlAsArray[temporaryCompetitionsIndex + 1], 10);
                }

                const temporaryRoundIndex = urlAsArray.findIndex(item => item === 'round');
                if (temporaryRoundIndex > -1) {
                    this.round = parseInt(urlAsArray[temporaryRoundIndex + 1], 10);
                }

                this.setPageTitle();

                if (!this.competitionId) {
                    return;
                }

                this.setPath(this.competitionId);
                this.getTeamMatchesData(this.competitionId, this.round);
            }
        });
    }
}
