import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Competition } from '@models/v2/competition.model';
import { TeamRating } from '@models/v2/team/team-rating.model';
import { TeamRatingUser } from '@models/v2/team/team-rating-user.model';
import { PaginatedResponse } from '@models/paginated-response.model';
import { TeamRatingSearch } from '@models/search/team/team-rating-search.model';
import { TeamRatingUserSearch } from '@models/search/team/team-rating-user-search.model';
import { User } from '@models/v2/user.model';
import { AuthService } from '@services/v2/auth.service';
import { CompetitionService } from '@services/v2/competition.service';
import { TeamRatingUserService } from '@services/v2/team/team-rating-user.service';
import { TeamRatingService } from '@services/v2/team/team-rating.service';
import { PaginationService } from '@services/pagination.service';
import { TitleService } from '@services/title.service';
import { groupBy } from 'lodash';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
   selector: 'app-team-rating',
   styleUrls: ['./team-rating.component.scss'],
   templateUrl: './team-rating.component.html'
})
export class TeamRatingComponent implements OnDestroy, OnInit {
   activeTab = 'teams';
   public activatedRouteSubscription: Subscription;
   public authenticatedUser: User;
   public competitionId: number;
   public teamRating: TeamRating[] = [];
   public groupedRating: { [groupNumber: string]: TeamRating[] };
   public teamRatingUser: TeamRatingUser[] = [];
   public competition: Competition;

   constructor(
      private authService: AuthService,
      private activatedRoute: ActivatedRoute,
      private competitionService: CompetitionService,
      private router: Router,
      private teamRatingService: TeamRatingService,
      private teamRatingUserService: TeamRatingUserService,
      private titleService: TitleService
   ) {}

   public competitionSelected(event: { selected: Competition | Partial<Competition> }): void {
      this.router.navigate(['/team', 'rating', { competition_id: event.selected.id }]);
   }

   public ngOnDestroy() {
      if (!this.activatedRouteSubscription.closed) {
         this.activatedRouteSubscription.unsubscribe();
      }
   }

   public ngOnInit() {
      this.titleService.setTitle('Рейтинг команд, бомбардирів і воротарів - Командний');
      this.authenticatedUser = this.authService.getUser();
      this.activatedRouteSubscription = this.activatedRoute.params
         .pipe(filter(params => params.competition_id))
         .subscribe((params: Params) => {
            this.competitionId = params.competition_id;
            this.getTeamRatingData();
            this.getTeamRatingUserData();
            this.competition = null;
            this.getCompetitionData(params.competition_id);
         });
   }

   private getCompetitionData(id: number): void {
      this.competitionService.getCompetition(id).subscribe(response => {
         this.competition = response;
      });
   }

   private getTeamRatingData() {
      const search: TeamRatingSearch = {
         competitionId: this.competitionId,
         page: 1,
         relations: ['team'],
         limit: PaginationService.limit.teamRatingItems
      };
      this.teamRatingService.getTeamRating(search).subscribe(response => this.setTeamRating(response));
   }

   private getTeamRatingUserData() {
      const search: TeamRatingUserSearch = {
         competitionId: this.competitionId,
         page: 1,
         relations: ['team', 'user'],
         limit: PaginationService.limit.teamRatingUsers
      };
      this.teamRatingUserService.getTeamRatingUser(search).subscribe(response => (this.teamRatingUser = response.data));
   }

   private setTeamRating(response: PaginatedResponse<TeamRating>): void {
      if (response.data.length && response.data[0].group_number) {
         this.groupedRating = groupBy(response.data, teamRating => teamRating.group_number);
         this.teamRating = [];
      } else {
         this.teamRating = response.data;
         this.groupedRating = null;
      }
   }
}
