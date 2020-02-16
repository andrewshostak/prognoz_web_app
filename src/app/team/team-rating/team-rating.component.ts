import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

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
      private teamRatingService: TeamRatingService,
      private teamRatingUserService: TeamRatingUserService,
      private titleService: TitleService
   ) {}

   public ngOnDestroy() {
      if (!this.activatedRouteSubscription.closed) {
         this.activatedRouteSubscription.unsubscribe();
      }
   }

   public ngOnInit() {
      this.titleService.setTitle('Рейтинг команд, бомбардирів і воротарів - Командний');
      this.authenticatedUser = this.currentStateService.getUser();
      this.activatedRouteSubscription = this.activatedRoute.parent.params.subscribe((params: Params) => {
         if (params.competitionId === 'get-active') {
            return;
         }
         this.competitionId = params.competitionId;
         this.getTeamRatingData();
         this.getTeamRatingUserData();
         this.competition = null;
         this.getCompetitionData(params.competitionId);
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
