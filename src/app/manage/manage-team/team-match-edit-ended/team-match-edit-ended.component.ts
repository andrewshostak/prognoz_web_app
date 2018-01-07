import { Component, OnInit }    from '@angular/core';

import { environment }          from '../../../../environments/environment';
import { NotificationsService } from 'angular2-notifications';
import { TeamMatchService }     from '../../../team/shared/team-match.service';
import { TeamMatch }            from '../../../shared/models/team-match.model';

@Component({
    selector: 'app-team-match-edit-ended',
    templateUrl: './team-match-edit-ended.component.html',
    styleUrls: ['./team-match-edit-ended.component.css']
})
export class TeamMatchEditEndedComponent implements OnInit {

    constructor(
        private notificationService: NotificationsService,
        private teamMatchService: TeamMatchService,
    ) {}

    clubsImagesUrl: string = environment.apiImageClubs;
    errorTeamMatches: string;
    spinnerButton: any = {};
    teamMatches: TeamMatch[];
    updatedMatches: any = {};

    ngOnInit() {
        this.getTeamMatchesData();
    }

    onSubmit(teamMatch: TeamMatch) {
        if (!this.validateResult(teamMatch.home) || !this.validateResult(teamMatch.away)) {
            this.notificationService.error('Помилка', 'Результат в матчі ' + teamMatch.id + ' введено неправильно');
            return;
        }
        this.spinnerButton['match_' + teamMatch.id] = true;
        const teamMatchToUpdate = new TeamMatch();
        teamMatchToUpdate.id = teamMatch.id;
        teamMatchToUpdate.home = teamMatch.home;
        teamMatchToUpdate.away = teamMatch.away;
        teamMatchToUpdate.t1_id = teamMatch.t1_id;
        teamMatchToUpdate.t2_id = teamMatch.t2_id;
        this.teamMatchService.updateTeamMatch(teamMatchToUpdate).subscribe(
            response => {
                this.spinnerButton['match_' + teamMatch.id] = false;
                this.updatedMatches['match_' + teamMatch.id] = response;
                this.notificationService.success('Успішно', 'Результат в матчі ' + response.id + ' змінено!');
            },
            errors => {
                this.spinnerButton['match_' + teamMatch.id] = false;
                errors.forEach(error => this.notificationService.error('Помилка', error));
            }
        );
    }

    private getTeamMatchesData() {
        const param = [{parameter: 'filter', value: 'ended'}];
        this.teamMatchService.getTeamMatches(param).subscribe(
            response => {
                if (response) {
                    this.teamMatches = response.team_matches;
                }
            },
            error => {
                this.errorTeamMatches = error;
            }
        );
    }

    private validateResult(score) {
        let regExp = /^[0-9]$/;
        return regExp.test(score);
    }
}
