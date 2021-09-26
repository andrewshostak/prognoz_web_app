import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

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
   @Input() authenticatedUser: User;

   goalkeepersRating: TeamRatingUser[] = [];
   goalkeepersRatingAll: TeamRatingUser[] = [];
   teams: Team[] = [];
   topScorersRating: TeamRatingUser[] = [];
   topScorersRatingAll: TeamRatingUser[] = [];
   selectedTeamId: number = null;

   clickOnTeamButton(teamId: number): void {
      if (this.selectedTeamId !== teamId) {
         this.selectedTeamId = teamId;

         this.topScorersRating = this.topScorersRatingAll.filter(user => {
            return user.team_id === this.selectedTeamId;
         });
         this.goalkeepersRating = this.goalkeepersRatingAll.filter(user => {
            return user.team_id === this.selectedTeamId;
         });
      } else {
         this.selectedTeamId = null;
         this.topScorersRating = this.topScorersRatingAll;
         this.goalkeepersRating = this.goalkeepersRatingAll;
      }
   }

   isTeamSelected(teamId: number): boolean {
      return this.selectedTeamId === teamId;
   }

   ngOnChanges(changes: SimpleChanges) {
      for (const propName in changes) {
         if (!changes[propName].firstChange && propName === 'teamRatingUser') {
            this.topScorersRating = this.formTeamUserRating(changes[propName].currentValue, 'scored');
            this.topScorersRatingAll = this.topScorersRating;
            this.goalkeepersRating = this.formTeamUserRating(changes[propName].currentValue, 'blocked');
            this.goalkeepersRatingAll = this.goalkeepersRating;
            this.selectedTeamId = null;
            this.teams = [];
            changes[propName].currentValue.forEach(user => {
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
