import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { ChampionshipRatingNewService } from '@services/new/championship-rating-new.service';
import { AuthNewService } from '@services/new/auth-new.service';
import { TitleService } from '@services/title.service';
import { User } from '@models/v2/user.model';
import { ChampionshipRating } from '@models/v2/championship/championship-rating.model';
import { ChampionshipRatingSearch } from '@models/search/championship/championship-rating-search.model';
import { SettingsService } from '@services/settings.service';
import { Sequence } from '@enums/sequence.enum';

@Component({
   selector: 'app-championship-competition-rating',
   templateUrl: './championship-competition-rating.component.html',
   styleUrls: ['./championship-competition-rating.component.scss']
})
export class ChampionshipCompetitionRatingComponent implements OnInit {
   constructor(
      private authService: AuthNewService,
      private activatedRoute: ActivatedRoute,
      private championshipRatingService: ChampionshipRatingNewService,
      private titleService: TitleService
   ) {}

   authenticatedUser: User;
   championshipRatingItems: ChampionshipRating[];

   ngOnInit() {
      this.authenticatedUser = this.authService.getUser();
      this.activatedRoute.params.forEach((params: Params) => {
         this.titleService.setTitle(`Рейтинг гравців в конкурсі ${params.competitionId} - Чемпіонат`);
         const search: ChampionshipRatingSearch = {
            competitionId: params.competitionId,
            page: 1,
            limit: SettingsService.maxLimitValues.championshipRating,
            relations: ['user.mainClub'],
            orderBy: 'rating',
            sequence: Sequence.Descending
         };
         this.championshipRatingService.getChampionshipRating(search).subscribe(
            response => {
               this.resetChampionshipRatingData();
               this.championshipRatingItems = response.data;
            },
            () => {
               this.resetChampionshipRatingData();
            }
         );
      });
   }

   private resetChampionshipRatingData() {
      this.championshipRatingItems = null;
   }
}
