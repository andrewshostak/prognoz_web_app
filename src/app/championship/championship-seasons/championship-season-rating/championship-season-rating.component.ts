import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { ChampionshipRatingService } from '@services/api/v2/championship/championship-rating.service';
import { ChampionshipRating } from '@models/v2/championship/championship-rating.model';
import { CurrentStateService } from '@services/current-state.service';
import { User } from '@models/v2/user.model';
import { TitleService } from '@services/title.service';

@Component({
   selector: 'app-championship-season-rating',
   templateUrl: './championship-season-rating.component.html',
   styleUrls: ['./championship-season-rating.component.scss']
})
export class ChampionshipSeasonRatingComponent implements OnInit {
   constructor(
      private activatedRoute: ActivatedRoute,
      private championshipRatingService: ChampionshipRatingService,
      private currentStateService: CurrentStateService,
      private titleService: TitleService
   ) {}

   authenticatedUser: User;
   championshipRatingItems: Partial<ChampionshipRating>[];

   ngOnInit() {
      this.authenticatedUser = this.currentStateService.getUser();
      this.activatedRoute.params.forEach((params: Params) => {
         this.titleService.setTitle(`Рейтинг гравців в сезоні ${params.id} - Чемпіонат`);
         this.championshipRatingService.getChampionshipRatingSeason(params.id as number).subscribe(response => {
            this.championshipRatingItems = response.map(item => {
               return { user: item.user, points: item.points } as Partial<ChampionshipRating>;
            });
         });
      });
   }
}
