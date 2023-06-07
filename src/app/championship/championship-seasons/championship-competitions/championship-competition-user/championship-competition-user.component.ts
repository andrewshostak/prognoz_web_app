import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { ChampionshipRatingNew } from '@models/v2/championship-rating-new.model';
import { UserNew } from '@models/v2/user-new.model';
import { ChampionshipRatingNewService } from '@services/new/championship-rating-new.service';
import { UserNewService } from '@services/new/user-new.service';
import { TitleService } from '@services/title.service';
import { UtilsService } from '@services/utils.service';
import { ChampionshipRatingSearch } from '@models/search/championship-rating-search.model';
import { ChampionshipPredictionNewService } from '@services/new/championship-prediction-new.service';
import { ChampionshipPredictionNew } from '@models/v2/championship-prediction-new.model';
import { ChampionshipPredictionSearch } from '@models/search/championship-prediction-search.model';
import { SettingsService } from '@services/settings.service';
import { Sequence } from '@enums/sequence.enum';

@Component({
   selector: 'app-championship-competition-user',
   templateUrl: './championship-competition-user.component.html',
   styleUrls: ['./championship-competition-user.component.scss']
})
export class ChampionshipCompetitionUserComponent implements OnInit {
   public championshipPredictions: ChampionshipPredictionNew[];
   public championshipRatingItem: ChampionshipRatingNew;
   public competitionId: number;
   public user: UserNew;
   constructor(
      private activatedRoute: ActivatedRoute,
      private championshipPredictionService: ChampionshipPredictionNewService,
      private championshipRatingService: ChampionshipRatingNewService,
      private titleService: TitleService,
      private userService: UserNewService
   ) {}

   public ngOnInit() {
      this.activatedRoute.params.forEach((params: Params) => {
         this.competitionId = params.competitionId;
         this.getUserData(params.userId);
         this.getChampionshipRatingItemData(params.userId, params.competitionId);
         this.getChampionshipPredictionsData(params.userId, params.competitionId);
      });
   }

   private getChampionshipPredictionsData(userId: number, competitionId: number) {
      const search: ChampionshipPredictionSearch = {
         competitionId,
         limit: SettingsService.maxLimitValues.championshipPredictions,
         orderBy: 'number_in_competition',
         page: 1,
         sequence: Sequence.Descending,
         userId
      };
      this.championshipPredictionService
         .getPredictionsByUserId(search)
         .subscribe(response => (this.championshipPredictions = response.data));
   }

   private getChampionshipRatingItemData(userId: number, competitionId: number) {
      const search: ChampionshipRatingSearch = { limit: 1, competitionId, page: 1, userId };
      this.championshipRatingService
         .getChampionshipRating(search)
         .subscribe(response => (this.championshipRatingItem = response.total ? response.data[0] : null));
   }

   private getUserData(id: number) {
      this.userService.getUser(id, ['clubs', 'winners.award', 'winners.competition.season']).subscribe(response => {
         this.user = response;
         this.titleService.setTitle(`Прогнози ${this.user.name}
                    ${UtilsService.getHomeCityInBrackets(this.user.hometown)} в конкурсі ${this.competitionId} - Чемпіонат`);
      });
   }
}
