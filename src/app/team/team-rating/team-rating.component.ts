import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { CompetitionNew } from '@models/new/competition-new.model';
import { RequestParams } from '@models/request-params.model';
import { TeamRatingUser } from '@models/team/team-rating-user.model';
import { TeamRating } from '@models/team/team-rating.model';
import { User } from '@models/user.model';
import { CurrentStateService } from '@services/current-state.service';
import { CompetitionNewService } from '@services/new/competition-new.service';
import { TeamRatingUserService } from '@services/team/team-rating-user.service';
import { TeamRatingService } from '@services/team/team-rating.service';
import { TitleService } from '@services/title.service';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
   selector: 'app-team-rating',
   styleUrls: ['./team-rating.component.scss'],
   templateUrl: './team-rating.component.html'
})
export class TeamRatingComponent implements OnDestroy, OnInit {
   public activatedRouteSubscription: Subscription;
   public authenticatedUser: User;
   public competitionId: number;
   public errorTeamRating: string;
   public errorTeamRatingUser: string;
   public teamRating: TeamRating[];
   public teamRatingUser: TeamRatingUser[];
   public competition: CompetitionNew;

   constructor(
      private activatedRoute: ActivatedRoute,
      private competitionNewService: CompetitionNewService,
      private currentStateService: CurrentStateService,
      private router: Router,
      private teamRatingService: TeamRatingService,
      private teamRatingUserService: TeamRatingUserService,
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
      const params: RequestParams[] = [{ parameter: 'competition_id', value: this.competitionId.toString() }];
      this.teamRatingService.getTeamRating(params).subscribe(
         response => {
            this.teamRating = response ? response : [];
         },
         error => {
            this.errorTeamRating = error;
         }
      );
   }

   private getTeamRatingUserData() {
      const params: RequestParams[] = [{ parameter: 'competition_id', value: this.competitionId.toString() }];
      this.teamRatingUserService.getTeamRatingUser(params).subscribe(
         response => {
            this.teamRatingUser = response ? response : [];
         },
         error => {
            this.errorTeamRatingUser = error;
         }
      );
   }
}
