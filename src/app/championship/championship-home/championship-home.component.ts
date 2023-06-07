import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { MatchState } from '@enums/match-state.enum';
import { ModelStatus } from '@enums/model-status.enum';
import { Sequence } from '@enums/sequence.enum';
import { ChampionshipPrediction } from '@models/v2/championship/championship-prediction.model';
import { ChampionshipMatch } from '@models/v2/championship/championship-match.model';
import { ChampionshipMatchSearch } from '@models/search/championship/championship-match-search.model';
import { User } from '@models/v1/user.model';
import { ChampionshipPredictionNewService } from '@services/new/championship-prediction-new.service';
import { ChampionshipService } from '@services/championship/championship.service';
import { CurrentStateService } from '@services/current-state.service';
import { ChampionshipMatchNewService } from '@services/new/championship-match-new.service';
import { SettingsService } from '@services/settings.service';
import { TitleService } from '@services/title.service';
import { UtilsService } from '@services/utils.service';
import { NotificationsService } from 'angular2-notifications';
import { get } from 'lodash';
import { iif, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { PaginatedResponse } from '@models/paginated-response.model';
import { Competition } from '@models/v2/competition.model';
import { CompetitionSearch } from '@models/search/competition-search.model';
import { CompetitionState } from '@enums/competition-state.enum';
import { Tournament } from '@enums/tournament.enum';
import { CompetitionNewService } from '@services/new/competition-new.service';
import { ChampionshipRating } from '@models/v2/championship/championship-rating.model';
import { ChampionshipRatingSearch } from '@models/search/championship/championship-rating-search.model';
import { ChampionshipRatingNewService } from '@services/new/championship-rating-new.service';

@Component({
   selector: 'app-championship-home',
   styleUrls: ['./championship-home.component.scss'],
   templateUrl: './championship-home.component.html'
})
export class ChampionshipHomeComponent implements OnInit {
   public authenticatedUser: User;
   public championshipMatches: ChampionshipMatch[];
   public championshipPredictions: Partial<ChampionshipPrediction>[];
   public championshipPredictionsForm: FormGroup;
   public championshipRatingItems: ChampionshipRating[];
   public errorChampionshipMatches: string;
   public getHomeCityInBrackets = UtilsService.getHomeCityInBrackets;
   public ratingUpdatedAt: string;
   public spinnerButton = false;

   constructor(
      private championshipMatchService: ChampionshipMatchNewService,
      private championshipPredictionNewService: ChampionshipPredictionNewService,
      private championshipService: ChampionshipService,
      private championshipRatingService: ChampionshipRatingNewService,
      private competitionService: CompetitionNewService,
      private currentStateService: CurrentStateService,
      private notificationsService: NotificationsService,
      private titleService: TitleService
   ) {}

   public getChampionshipMatchesData(): void {
      const search: ChampionshipMatchSearch = {
         limit: SettingsService.maxLimitValues.championshipMatches,
         orderBy: 'started_at',
         page: 1,
         sequence: Sequence.Ascending,
         soon: ModelStatus.Truthy,
         states: [MatchState.Active]
      };

      if (this.authenticatedUser) {
         search.userId = this.authenticatedUser.id;
      }

      this.championshipMatchService
         .getChampionshipMatches(search)
         .pipe(
            mergeMap(response => {
               if (response.data.length) {
                  this.updateForm(response.data, !!this.authenticatedUser);
                  return of(null);
               }
               search.soon = ModelStatus.Falsy;
               search.limit = 3;
               return this.championshipMatchService.getChampionshipMatches(search);
            })
         )
         .subscribe(response => {
            if (!response) {
               return;
            }
            this.updateForm(response.data, !!this.authenticatedUser);
         });
   }

   public getChampionshipPredictionsData(): void {
      this.championshipPredictionNewService.getLastDistinctPredictions().subscribe(response => (this.championshipPredictions = response));
   }

   public getChampionshipRatingData(): void {
      this.getActiveCompetitionObservable()
         .pipe(
            mergeMap(competitionsResponse =>
               iif(
                  () => !!competitionsResponse.total,
                  this.getChampionshipRatingObservable(competitionsResponse.data[0].id),
                  of({ data: [] })
               )
            )
         )
         .subscribe(response => (this.championshipRatingItems = response.data));
   }

   public getLastMatchData(): void {
      const search: ChampionshipMatchSearch = {
         orderBy: 'updated_at',
         limit: 1,
         page: 1,
         sequence: Sequence.Descending,
         states: [MatchState.Ended]
      };
      this.championshipMatchService.getChampionshipMatches(search).subscribe(response => {
         this.ratingUpdatedAt = get(response, 'data[0].updated_at', null);
      });
   }

   public ngOnInit(): void {
      this.titleService.setTitle('Найближчі матчі, останні прогнози і топ-рейтингу - Чемпіонат');
      this.authenticatedUser = this.currentStateService.getUser();
      this.championshipPredictionsForm = new FormGroup({});
      this.getChampionshipMatchesData();
      this.getChampionshipRatingData();
      this.getChampionshipPredictionsData();
      this.getLastMatchData();
   }

   public onSubmit(): void {
      this.spinnerButton = true;
      const championshipPredictionsToUpdate = this.championshipService.createChampionshipPredictionsArray(this.championshipPredictionsForm);
      this.championshipPredictionNewService.upsertPredictions(championshipPredictionsToUpdate).subscribe(
         () => {
            this.spinnerButton = false;
            this.notificationsService.success('Успішно', 'Прогнози прийнято');
            this.getChampionshipMatchesData();
            this.getChampionshipPredictionsData();
         },
         () => (this.spinnerButton = false)
      );
   }

   private getActiveCompetitionObservable(): Observable<PaginatedResponse<Competition>> {
      const search: CompetitionSearch = {
         limit: 1,
         states: [CompetitionState.Active],
         page: 1,
         tournamentId: Tournament.Championship
      };
      return this.competitionService.getCompetitions(search);
   }

   private getChampionshipRatingObservable(competitionId: number): Observable<PaginatedResponse<ChampionshipRating>> {
      const search: ChampionshipRatingSearch = {
         limit: 5,
         relations: ['user.mainClub'],
         competitionId,
         page: 1,
         orderBy: 'rating',
         sequence: Sequence.Descending
      };
      return this.championshipRatingService.getChampionshipRating(search);
   }

   private updateForm(championshipMatches: ChampionshipMatch[], isAuthenticatedUser: boolean): void {
      this.championshipMatches = championshipMatches;
      if (isAuthenticatedUser) {
         this.championshipPredictionsForm = new FormGroup({});
         for (const championshipMatch of this.championshipMatches) {
            const home = championshipMatch.championship_predicts.length ? championshipMatch.championship_predicts[0].home : null;
            const away = championshipMatch.championship_predicts.length ? championshipMatch.championship_predicts[0].away : null;
            this.championshipPredictionsForm.addControl(championshipMatch.id + '_home', new FormControl(home));
            this.championshipPredictionsForm.addControl(championshipMatch.id + '_away', new FormControl(away));
         }
      } else {
         for (const championshipMatch of this.championshipMatches) {
            this.championshipPredictionsForm.removeControl(championshipMatch.id + '_home');
            this.championshipPredictionsForm.removeControl(championshipMatch.id + '_away');
         }
      }
   }
}
