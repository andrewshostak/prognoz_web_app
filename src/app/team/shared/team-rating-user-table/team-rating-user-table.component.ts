import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { environment } from '@env';
import { Team } from '@models/team/team.model';
import { TeamRatingUser } from '@models/team/team-rating-user.model';
import { User } from '@models/user.model';

@Component({
    selector: 'app-team-rating-user-table',
    templateUrl: './team-rating-user-table.component.html',
    styleUrls: ['./team-rating-user-table.component.scss']
})
export class TeamRatingUserTableComponent implements OnChanges {
    @Input() teamRatingUser: TeamRatingUser[];
    @Input() errorTeamRatingUser: string;
    @Input() authenticatedUser: User;

    goalkeepersRating: TeamRatingUser[];
    goalkeepersRatingAll: TeamRatingUser[];
    teamImageDefault: string = environment.imageTeamDefault;
    teamImagesUrl: string = environment.apiImageTeams;
    teams: Team[];
    teamIdsFiltered: number[];
    topScorersRating: TeamRatingUser[];
    topScorersRatingAll: TeamRatingUser[];
    userImageDefault: string = environment.imageUserDefault;
    userImagesUrl: string = environment.apiImageUsers;

    constructor() {}

    filterTeamRatingUser(team: Team): void {
        if (!this.teamIdsFiltered) {
            this.teamIdsFiltered = [team.id];
        } else {
            const alreadyInFilteredTeams = this.teamIdsFiltered.findIndex(teamIdFiltered => teamIdFiltered === team.id);
            alreadyInFilteredTeams < 0 ? this.teamIdsFiltered.push(team.id) : this.teamIdsFiltered.splice(alreadyInFilteredTeams, 1);
        }
        if (!this.teamIdsFiltered.length) {
            this.topScorersRating = this.topScorersRatingAll;
            this.goalkeepersRating = this.goalkeepersRatingAll;
        } else {
            this.topScorersRating = this.topScorersRatingAll.filter(user => {
                return this.teamIdsFiltered.includes(user.team_id);
            });
            this.goalkeepersRating = this.goalkeepersRatingAll.filter(user => {
                return this.teamIdsFiltered.includes(user.team_id);
            });
        }
    }

    isTeamSelected(teamId: number): boolean {
        return this.teamIdsFiltered && this.teamIdsFiltered.length ? this.teamIdsFiltered.includes(teamId) : true;
    }

    ngOnChanges(changes: SimpleChanges) {
        for (const propName in changes) {
            if (!changes[propName].firstChange && propName === 'teamRatingUser') {
                this.topScorersRating = this.formTeamUserRating(changes[propName].currentValue, 'scored');
                this.topScorersRatingAll = this.topScorersRating;
                this.goalkeepersRating = this.formTeamUserRating(changes[propName].currentValue, 'blocked');
                this.goalkeepersRatingAll = this.goalkeepersRating;
                changes[propName].currentValue.forEach(user => {
                    if (!this.teams) {
                        this.teams = [];
                    }
                    const filteredTeamIds = this.teams.map(item => item.id);
                    if (!filteredTeamIds.includes(user.team_id)) {
                        this.teams.push(user.team);
                    }
                });
            }
        }
    }

    private filterTeamUserRating(teamRatingUser: TeamRatingUser[], column: string): TeamRatingUser[] {
        return teamRatingUser.filter(ratingItem => ratingItem[column]);
    }

    private sortTeamUserRating(teamRatingUser: TeamRatingUser[], column: string): TeamRatingUser[] {
        return teamRatingUser.sort((a, b) => b[column] - a[column]);
    }

    private formTeamUserRating(teamRatingUser: TeamRatingUser[], column: string = 'scored'): TeamRatingUser[] {
        const filtered = this.filterTeamUserRating(teamRatingUser, column);
        return this.sortTeamUserRating(filtered, column);
    }
}
