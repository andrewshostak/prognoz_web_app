import { Component, OnInit } from '@angular/core';

import { environment } from '../../../../environments/environment';
import { NotificationsService } from 'angular2-notifications';
import { TeamMatch } from '../../../shared/models/team-match.model';
import { TeamMatchService } from '../../../team/shared/team-match.service';

@Component({
    selector: 'app-team-match-edit',
    templateUrl: './team-match-edit.component.html',
    styleUrls: ['./team-match-edit.component.css']
})
export class TeamMatchEditComponent implements OnInit {
    clubsImagesUrl: string = environment.apiImageClubs;
    errorTeamMatches: string;
    spinnerButton: any = {};
    teamMatches: TeamMatch[];
    updatedMatches: any = {};

    constructor(private teamMatchService: TeamMatchService, private notificationService: NotificationsService) {}

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

        this.teamMatchService.updateTeamMatch(teamMatchToUpdate).subscribe(
            response => {
                this.spinnerButton['match_' + teamMatch.id] = false;
                this.updatedMatches['match_' + teamMatch.id] = response;
                this.notificationService.success('Успішно', 'Результат в матчі ' + response.id + ' добавлено!');
            },
            errors => {
                this.spinnerButton['match_' + teamMatch.id] = false;
                errors.forEach(error => this.notificationService.error('Помилка', error));
            }
        );
    }

    private getTeamMatchesData(): void {
        const param = [{ parameter: 'filter', value: 'active' }];
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
        const regExp = /^[0-9]$/;
        return regExp.test(score);
    }
}
