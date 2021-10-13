import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { ModelStatus } from '@enums/model-status.enum';
import { Sequence } from '@enums/sequence.enum';
import { Tournament } from '@enums/tournament.enum';
import { ChampionshipRating } from '@models/championship/championship-rating.model';
import { ChampionshipPredictionNew } from '@models/new/championship-prediction-new.model';
import { CompetitionNew } from '@models/new/competition-new.model';
import { UserNew } from '@models/new/user-new.model';
import { PaginatedResponse } from '@models/paginated-response.model';
import { ChampionshipPredictionSearch } from '@models/search/championship-prediction-search.model';
import { CompetitionSearch } from '@models/search/competition-search.model';
import { ChampionshipRatingService } from '@services/championship/championship-rating.service';
import { ChampionshipPredictionNewService } from '@services/new/championship-prediction-new.service';
import { CompetitionNewService } from '@services/new/competition-new.service';
import { UserNewService } from '@services/new/user-new.service';
import { SettingsService } from '@services/settings.service';
import { TitleService } from '@services/title.service';
import { UtilsService } from '@services/utils.service';
import { Observable, throwError } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Component({
   selector: 'app-championship-user',
   styleUrls: ['./championship-user.component.scss'],
   templateUrl: './championship-user.component.html'
})
export class ChampionshipUserComponent implements OnInit {
   public championshipPredictions: ChampionshipPredictionNew[];
   public championshipRatingItem: ChampionshipRating;
   public errorChampionshipPredictions: string;
   public errorRating: string;
   public user: UserNew;

   constructor(
      private activatedRoute: ActivatedRoute,
      private championshipPredictionService: ChampionshipPredictionNewService,
      private championshipRatingService: ChampionshipRatingService,
      private competitionService: CompetitionNewService,
      private titleService: TitleService,
      private userService: UserNewService
   ) {}

   public ngOnInit(): void {
      this.activatedRoute.params.forEach((params: Params) => {
         this.getUserData(params.id);
         this.getChampionshipRatingItemData(params.id);
         this.getChampionshipPredictionsData(params.id);
      });
   }

   private getActiveChampionshipCompetition(): Observable<PaginatedResponse<CompetitionNew>> {
      const search: CompetitionSearch = {
         active: ModelStatus.Truthy,
         limit: 1,
         page: 1,
         tournamentId: Tournament.Championship
      };

      return this.competitionService.getCompetitions(search);
   }

   private getChampionshipPredictionsData(userId: number): void {
      this.getActiveChampionshipCompetition()
         .pipe(
            mergeMap(competitionResponse => {
               if (!competitionResponse.data[0]) {
                  return throwError('Активних змагань не знайдено');
               }
               return this.getChampionshipPredictions(competitionResponse.data[0].id, userId);
            })
         )
         .subscribe(
            response => {
               this.championshipPredictions = response.data;
            },
            error => {
               this.errorChampionshipPredictions = error;
            }
         );
   }

   private getChampionshipPredictions(competitionId, userId: number): Observable<PaginatedResponse<ChampionshipPredictionNew>> {
      const search: ChampionshipPredictionSearch = {
         competitionId,
         limit: SettingsService.maxLimitValues.championshipPredictions,
         orderBy: 'number_in_competition',
         page: 1,
         sequence: Sequence.Descending,
         userId
      };
      return this.championshipPredictionService.getPredictionsByUserId(search);
   }

   private getChampionshipRatingItemData(id: number) {
      this.championshipRatingService.getChampionshipRatingItem(id).subscribe(
         response => {
            this.championshipRatingItem = response;
         },
         error => {
            this.errorRating = error;
         }
      );
   }

   private getUserData(id: number) {
      this.userService.getUser(id, ['clubs', 'winners.award', 'winners.competition.season']).subscribe(response => {
         this.user = response;
         this.titleService.setTitle(`Прогнози ${this.user.name}
                    ${UtilsService.getHomeCityInBrackets(this.user.hometown)} - Чемпіонат`);
      });
   }
}
