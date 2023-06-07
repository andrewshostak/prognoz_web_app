import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { CompetitionState } from '@enums/competition-state.enum';
import { Sequence } from '@enums/sequence.enum';
import { Tournament } from '@enums/tournament.enum';
import { ChampionshipRating } from '@models/v2/championship/championship-rating.model';
import { ChampionshipPrediction } from '@models/v2/championship/championship-prediction.model';
import { Competition } from '@models/v2/competition.model';
import { User } from '@models/v2/user.model';
import { PaginatedResponse } from '@models/paginated-response.model';
import { ChampionshipPredictionSearch } from '@models/search/championship/championship-prediction-search.model';
import { CompetitionSearch } from '@models/search/competition-search.model';
import { ChampionshipRatingNewService } from '@services/new/championship-rating-new.service';
import { ChampionshipPredictionNewService } from '@services/new/championship-prediction-new.service';
import { CompetitionNewService } from '@services/new/competition-new.service';
import { UserNewService } from '@services/new/user-new.service';
import { SettingsService } from '@services/settings.service';
import { TitleService } from '@services/title.service';
import { UtilsService } from '@services/utils.service';
import { forkJoin, iif, Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { ChampionshipRatingSearch } from '@models/search/championship/championship-rating-search.model';

@Component({
   selector: 'app-championship-user',
   styleUrls: ['./championship-user.component.scss'],
   templateUrl: './championship-user.component.html'
})
export class ChampionshipUserComponent implements OnInit {
   public championshipPredictions: ChampionshipPrediction[];
   public championshipRatingItem: ChampionshipRating;
   public user: User;

   constructor(
      private activatedRoute: ActivatedRoute,
      private championshipPredictionService: ChampionshipPredictionNewService,
      private championshipRatingService: ChampionshipRatingNewService,
      private competitionService: CompetitionNewService,
      private titleService: TitleService,
      private userService: UserNewService
   ) {}

   public ngOnInit(): void {
      this.activatedRoute.params.forEach((params: Params) => {
         this.getPageData(params.id);
      });
   }

   private getPageData(userId: number): void {
      this.getUserData(userId);
      this.getActiveChampionshipCompetitionObservable()
         .pipe(
            mergeMap(competitionsResponse =>
               iif(
                  () => !!competitionsResponse.total,
                  forkJoin([
                     this.getChampionshipPredictionsObservable(competitionsResponse.data[0].id, userId),
                     this.getChampionshipRatingItemObservable(competitionsResponse.data[0].id, userId)
                  ]).pipe(
                     map(([championshipPredictions, championshipRating]) => {
                        return { championshipPredictions, championshipRating };
                     })
                  ),
                  of({ championshipPredictions: { data: [], total: 0 }, championshipRating: { data: [], total: 0 } })
               )
            )
         )
         .subscribe(response => {
            this.championshipPredictions = response.championshipPredictions.data;
            this.championshipRatingItem = response.championshipRating.total ? response.championshipRating.data[0] : [];
         });
   }

   private getActiveChampionshipCompetitionObservable(): Observable<PaginatedResponse<Competition>> {
      const search: CompetitionSearch = {
         limit: 1,
         page: 1,
         states: [CompetitionState.Active],
         tournamentId: Tournament.Championship
      };

      return this.competitionService.getCompetitions(search);
   }

   private getChampionshipPredictionsObservable(competitionId, userId: number): Observable<PaginatedResponse<ChampionshipPrediction>> {
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

   private getChampionshipRatingItemObservable(competitionId: number, userId: number): Observable<PaginatedResponse<ChampionshipRating>> {
      const search: ChampionshipRatingSearch = { limit: 1, competitionId, page: 1, userId };
      return this.championshipRatingService.getChampionshipRating(search);
   }

   private getUserData(id: number) {
      this.userService.getUser(id, ['clubs', 'winners.award', 'winners.competition.season']).subscribe(response => {
         this.user = response;
         this.titleService.setTitle(`Прогнози ${this.user.name}
                    ${UtilsService.getHomeCityInBrackets(this.user.hometown)} - Чемпіонат`);
      });
   }
}
