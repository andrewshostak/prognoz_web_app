import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { ChampionshipRating } from '@models/v2/championship/championship-rating.model';
import { User } from '@models/v2/user.model';
import { ChampionshipRatingService } from '@services/api/v2/championship/championship-rating.service';
import { UserService } from '@services/api/v2/user.service';
import { TitleService } from '@services/title.service';
import { UtilsService } from '@services/utils.service';
import { ChampionshipRatingSearch } from '@models/search/championship/championship-rating-search.model';
import { ChampionshipPredictionService } from '@services/api/v2/championship/championship-prediction.service';
import { ChampionshipPrediction } from '@models/v2/championship/championship-prediction.model';
import { ChampionshipPredictionSearch } from '@models/search/championship/championship-prediction-search.model';
import { PaginationService } from '@services/pagination.service';
import { Sequence } from '@enums/sequence.enum';

@Component({
   selector: 'app-championship-competition-user',
   templateUrl: './championship-competition-user.component.html',
   styleUrls: ['./championship-competition-user.component.scss']
})
export class ChampionshipCompetitionUserComponent implements OnInit {
   public championshipPredictions: ChampionshipPrediction[];
   public championshipRatingItem: ChampionshipRating;
   public competitionId: number;
   public user: User;
   constructor(
      private activatedRoute: ActivatedRoute,
      private championshipPredictionService: ChampionshipPredictionService,
      private championshipRatingService: ChampionshipRatingService,
      private titleService: TitleService,
      private userService: UserService
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
         limit: PaginationService.limit.championshipPredictions,
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
