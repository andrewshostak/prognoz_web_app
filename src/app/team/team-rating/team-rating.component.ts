import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { CompetitionNew } from '@models/new/competition-new.model';
import { TeamRatingUserNew } from '@models/new/team-rating-user-new.model';
import { TeamRatingNew } from '@models/new/team-rating-new.model';
import { TeamRatingUserSearch } from '@models/search/team-rating-user-search.model';
import { User } from '@models/user.model';
import { CurrentStateService } from '@services/current-state.service';
import { CompetitionNewService } from '@services/new/competition-new.service';
import { TeamRatingUserNewService } from '@services/new/team-rating-user-new.service';
import { TeamRatingNewService } from '@services/new/team-rating-new.service';
import { TitleService } from '@services/title.service';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { TeamRatingSearch } from '@models/search/team-rating-search.model';
import { SettingsService } from '@services/settings.service';

@Component({
   selector: 'app-team-rating',
   styleUrls: ['./team-rating.component.scss'],
   templateUrl: './team-rating.component.html'
})
export class TeamRatingComponent implements OnDestroy, OnInit {
   public activatedRouteSubscription: Subscription;
   public authenticatedUser: User;
   public competitionId: number;
   public teamRating: TeamRatingNew[] = [];
   public teamRatingUser: TeamRatingUserNew[] = [];
   public competition: CompetitionNew;

   constructor(
      private activatedRoute: ActivatedRoute,
      private competitionNewService: CompetitionNewService,
      private currentStateService: CurrentStateService,
      private router: Router,
      private teamRatingService: TeamRatingNewService,
      private teamRatingUserService: TeamRatingUserNewService,
      private titleService: TitleService
   ) {}

   public competitionSelected(event: { selected: CompetitionNew | Partial<CompetitionNew> }): void {
      this.router.navigate(['/team', 'rating', { competition_id: event.selected.id }]);
   }

   public ngOnDestroy() {
      if (!this.activatedRouteSubscription.closed) {
         this.activatedRouteSubscription.unsubscribe();
      }
   }

   public ngOnInit() {
      this.titleService.setTitle('Рейтинг команд, бомбардирів і воротарів - Командний');
      this.authenticatedUser = this.currentStateService.getUser();
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
      this.competitionNewService.getCompetition(id).subscribe(response => {
         this.competition = response;
      });
   }

   private getTeamRatingData() {
      const search: TeamRatingSearch = {
         competitionId: this.competitionId,
         page: 1,
         relations: ['team'],
         limit: SettingsService.maxLimitValues.teamRatingItems
      };
      this.teamRatingService.getTeamRating(search).subscribe(response => (this.teamRating = response.data));
   }

   private getTeamRatingUserData() {
      const search: TeamRatingUserSearch = {
         competitionId: this.competitionId,
         page: 1,
         relations: ['team', 'user'],
         limit: SettingsService.maxLimitValues.teamRatingUsers
      };
      this.teamRatingUserService.getTeamRatingUser(search).subscribe(response => (this.teamRatingUser = response.data));
   }
}
