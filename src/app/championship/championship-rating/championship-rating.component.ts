import { Component, OnInit } from '@angular/core';

import { ModelStatus } from '@enums/model-status.enum';
import { Sequence } from '@enums/sequence.enum';
import { ChampionshipRating } from '@models/championship/championship-rating.model';
import { ChampionshipMatchSearch } from '@models/search/championship-match-search.model';
import { User } from '@models/user.model';
import { ChampionshipRatingService } from '@services/championship/championship-rating.service';
import { CurrentStateService } from '@services/current-state.service';
import { ChampionshipMatchNewService } from '@services/new/championship-match-new.service';
import { TitleService } from '@services/title.service';
import { get } from 'lodash';

@Component({
   selector: 'app-championship-rating',
   templateUrl: './championship-rating.component.html',
   styleUrls: ['./championship-rating.component.scss']
})
export class ChampionshipRatingComponent implements OnInit {
   public authenticatedUser: User;
   public championshipRatingItems: ChampionshipRating[];
   public ratingUpdatedAt: string;

   constructor(
      private championshipRatingService: ChampionshipRatingService,
      private championshipMatchService: ChampionshipMatchNewService,
      private currentStateService: CurrentStateService,
      private titleService: TitleService
   ) {}

   public getLastMatchData(): void {
      const search: ChampionshipMatchSearch = {
         ended: ModelStatus.Truthy,
         orderBy: 'updated_at',
         limit: 1,
         page: 1,
         sequence: Sequence.Descending
      };
      this.championshipMatchService.getChampionshipMatches(search).subscribe(response => {
         this.ratingUpdatedAt = get(response, 'data[0].updated_at', null);
      });
   }

   public ngOnInit(): void {
      this.titleService.setTitle('Рейтинг гравців - Чемпіонат');
      this.authenticatedUser = this.currentStateService.getUser();
      this.getLastMatchData();
      this.championshipRatingService.getChampionshipRatingItems().subscribe(response => {
         if (response) {
            this.championshipRatingItems = response.championship_ratings;
         }
      });
   }
}
