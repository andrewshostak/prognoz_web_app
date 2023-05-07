import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { TeamNew } from '@models/new/team-new.model';
import { TeamRatingUserNew } from '@models/new/team-rating-user-new.model';
import { User } from '@models/user.model';

@Component({
   selector: 'app-team-rating-user',
   templateUrl: './team-rating-user.component.html'
})
export class TeamRatingUserComponent implements OnChanges {
   @Input() teamRatingUser: TeamRatingUserNew[];
   @Input() authenticatedUser: User;

   blockedScorersRating: TeamRatingUserNew[] = [];
   goalkeepersRating: TeamRatingUserNew[] = [];
   teams: TeamNew[] = [];
   topScorersRating: TeamRatingUserNew[] = [];
   selectedTeamId: number = null;
   tablesToShow: string[] = ['scorers', 'goalkeepers', 'blocked-scorers'];
   tablesToShowItems: { title: string; value: string[] }[] = [
      { title: 'Бомбардири', value: ['scorers'] },
      { title: 'Воротарі', value: ['goalkeepers'] },
      { title: 'Гравці голи яких заблокували', value: ['blocked-scorers'] }
   ];

   selectedTeamChanged(): void {
      this.topScorersRating = this.filterTeamUserRating(this.teamRatingUser, 'scored').filter(user =>
         this.selectedTeamId === null ? true : user.team_id === this.selectedTeamId
      );
      this.goalkeepersRating = this.filterTeamUserRating(this.teamRatingUser, 'blocked').filter(user =>
         this.selectedTeamId === null ? true : user.team_id === this.selectedTeamId
      );
      this.blockedScorersRating = this.filterTeamUserRating(this.teamRatingUser, 'scores_blocked').filter(user =>
         this.selectedTeamId === null ? true : user.team_id === this.selectedTeamId
      );
   }

   selectedTableChanged(tablesToShow: string[] | null): void {
      if (tablesToShow === null) {
         this.tablesToShow = ['scorers', 'goalkeepers', 'blocked-scorers'];
      }
   }

   ngOnChanges(changes: SimpleChanges) {
      if (changes.teamRatingUser && changes.teamRatingUser.currentValue) {
         this.topScorersRating = this.filterTeamUserRating(changes.teamRatingUser.currentValue, 'scored');
         this.goalkeepersRating = this.filterTeamUserRating(changes.teamRatingUser.currentValue, 'blocked');
         this.blockedScorersRating = this.filterTeamUserRating(changes.teamRatingUser.currentValue, 'scores_blocked');
         this.selectedTeamId = null;
         this.teams = this.getTeams(changes.teamRatingUser.currentValue);
      }
   }

   private filterTeamUserRating(teamRatingUser: TeamRatingUserNew[], column: string): TeamRatingUserNew[] {
      return teamRatingUser.filter(ratingItem => ratingItem[column]);
   }

   private getTeams(userRating: TeamRatingUserNew[]): TeamNew[] {
      return userRating.reduce((acc: TeamNew[], ratingItem) => {
         if (acc.findIndex(team => ratingItem.team.id === team.id) === -1) {
            acc.push(ratingItem.team);
         }
         return acc;
      }, []);
   }
}
