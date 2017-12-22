import { Component, OnInit }      from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { TeamMatch }              from '../../shared/models/team-match.model';
import { TeamMatchService }       from '../shared/team-match.service';
import { TitleService }           from '../../core/title.service';

@Component({
  selector: 'app-team-results',
  templateUrl: './team-results.component.html',
  styleUrls: ['./team-results.component.css']
})
export class TeamResultsComponent implements OnInit {

    constructor(
        private activatedRoute: ActivatedRoute,
        private titleService: TitleService,
        private teamMatchSevice: TeamMatchService
    ) { }

    errorTeamMatches: string;
    nextRound: string;
    path = '/team/results/round/';
    previousRound: string;
    round: number;
    teamMatches: TeamMatch[];

    ngOnInit() {
        this.activatedRoute.params.subscribe((params: Params) => {
            this.round = params['round'] || null;
            this.titleService.setTitle(`Результати ${this.round ? this.round + ' туру' : 'поточного туру'} - Командний`);
            this.getTeamMatchesData(this.round);
        });
    }

    getTeamMatchesData(round?: number) {
        const param = [{parameter: 'filter', value: 'round'}];
        if (round) {
            param.push({parameter: 'page', value: round.toString()});
        }
        this.teamMatchSevice.getTeamMatches(param).subscribe(
            response => {
                this.resetTeamMatchData();
                if (response) {
                    this.teamMatches = response.data;
                    this.nextRound = response.next_page_url;
                    this.previousRound = response.prev_page_url;
                }
            },
            error => {
                this.resetTeamMatchData();
                this.errorTeamMatches = error;
            }
        );
    }

    private resetTeamMatchData(): void {
        this.errorTeamMatches = null;
        this.teamMatches = null;
        this.nextRound = null;
        this.previousRound = null;
    }
}
