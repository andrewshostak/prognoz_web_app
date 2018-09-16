import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { TeamMatch } from '@models/team/team-match.model';
import { TeamMatchService } from '@services/team/team-match.service';

@Component({
    selector: 'app-team-match-edit',
    templateUrl: './team-match-edit.component.html',
    styleUrls: ['./team-match-edit.component.scss']
})
export class TeamMatchEditComponent implements OnInit {
    constructor(private activatedRoute: ActivatedRoute, private teamMatchService: TeamMatchService) {}

    teamMatch: TeamMatch;
    errorTeamMatch: string;

    ngOnInit() {
        this.activatedRoute.params.forEach((params: Params) => {
            this.getTeamMatchData(params.id);
        });
    }

    private getTeamMatchData(teamMatchId: number): void {
        this.teamMatchService.getTeamMatch(teamMatchId).subscribe(
            response => {
                this.teamMatch = response;
            },
            error => {
                this.errorTeamMatch = error;
            }
        );
    }
}
