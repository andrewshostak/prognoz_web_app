import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { ChampionshipPrediction } from '@models/championship/championship-prediction.model';
import { ChampionshipRatingNew } from '@models/new/championship-rating-new.model';
import { UserNew } from '@models/new/user-new.model';
import { ChampionshipPredictionService } from '@services/championship/championship-prediction.service';
import { ChampionshipRatingNewService } from '@services/new/championship-rating-new.service';
import { UserNewService } from '@services/new/user-new.service';
import { TitleService } from '@services/title.service';
import { UtilsService } from '@services/utils.service';
import { ChampionshipRatingSearch } from '@models/search/championship-rating-search.model';

@Component({
   selector: 'app-championship-competition-user',
   templateUrl: './championship-competition-user.component.html',
   styleUrls: ['./championship-competition-user.component.scss']
})
export class ChampionshipCompetitionUserComponent implements OnInit {
   public championshipPredictions: ChampionshipPrediction[];
   public championshipRatingItem: ChampionshipRatingNew;
   public competitionId: number;
   public errorChampionshipPredictions: string;
   public user: UserNew;
   constructor(
      private activatedRoute: ActivatedRoute,
      private championshipPredictionService: ChampionshipPredictionService,
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
      const param = [
         { parameter: 'user_id', value: userId.toString() },
         { parameter: 'competition_id', value: competitionId.toString() }
      ];
      this.championshipPredictionService.getChampionshipPredictions(param).subscribe(
         response => {
            if (response) {
               this.championshipPredictions = response.championship_predicts;
            }
         },
         error => {
            this.errorChampionshipPredictions = error;
         }
      );
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
