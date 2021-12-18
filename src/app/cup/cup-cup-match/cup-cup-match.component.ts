import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { TimePipe } from '@app/shared/pipes/time.pipe';
import { CupCupMatchState } from '@enums/cup-cup-match-state.enum';
import { MatchState } from '@enums/match-state.enum';
import { Sequence } from '@enums/sequence.enum';
import { CupCupMatchNew } from '@models/new/cup-cup-match-new.model';
import { CupMatchNew } from '@models/new/cup-match-new.model';
import { CupPredictionNew } from '@models/new/cup-prediction-new.model';
import { UserNew } from '@models/new/user-new.model';
import { PaginatedResponse } from '@models/paginated-response.model';
import { CupMatchSearch } from '@models/search/cup-match-search.model';
import { CupStageTypeService } from '@services/cup/cup-stage-type.service';
import { AuthNewService } from '@services/new/auth-new.service';
import { CupCupMatchNewService } from '@services/new/cup-cup-match-new.service';
import { CupMatchNewService } from '@services/new/cup-match-new.service';
import { CupPredictionNewService } from '@services/new/cup-prediction-new.service';
import { SettingsService } from '@services/settings.service';
import { TitleService } from '@services/title.service';
import { UtilsService } from '@services/utils.service';
import { isNil } from 'lodash';
import { forkJoin, Observable } from 'rxjs';
import { map, mergeMap, tap } from 'rxjs/operators';

@Component({
   selector: 'app-cup-cup-match',
   templateUrl: './cup-cup-match.component.html',
   styleUrls: ['./cup-cup-match.component.scss']
})
export class CupCupMatchComponent implements OnInit {
   public cupCupMatch: CupCupMatchNew;
   public cupCupMatchReadableResult: string;
   public cupCupMatchStates = CupCupMatchState;
   public matchesWithPredictions: {
      matchInfo: { match: CupMatchNew; readable: string };
      homePredictionInfo: { prediction: CupPredictionNew; readable: string; scored: boolean };
      awayPredictionInfo: { prediction: CupPredictionNew; readable: string; scored: boolean };
   }[] = [];
   public numberOfMatchesInStage = CupStageTypeService.numberOfMatchesInStage;
   public predictionsNumber = { home: 0, away: 0 };
   public user: UserNew;

   private cupMatches: CupMatchNew[] = [];

   constructor(
      private activatedRoute: ActivatedRoute,
      private authService: AuthNewService,
      private cupCupMatchService: CupCupMatchNewService,
      private cupMatchService: CupMatchNewService,
      private cupPredictionService: CupPredictionNewService,
      private timePipe: TimePipe,
      private titleService: TitleService
   ) {}

   public isCupMatchGuessed(cupMatch: CupMatchNew, cupPrediction: CupPredictionNew): boolean {
      if (!cupPrediction) {
         return false;
      }

      if (cupMatch.match.state === MatchState.Active) {
         return false;
      }

      if (isNil(cupPrediction.home) && isNil(cupPrediction.away)) {
         return false;
      }

      return cupMatch.match.home === cupPrediction.home && cupMatch.match.away === cupPrediction.away;
   }

   public ngOnInit(): void {
      this.user = this.authService.getUser();
      this.getPageData(this.activatedRoute.snapshot.params.cupCupMatchId);
   }

   private getCupCupMatchObservable(cupCupMatchId: number): Observable<CupCupMatchNew> {
      const relations = ['homeUser', 'awayUser', 'cupStage.competition', 'cupStage.CupStageType'];
      return this.cupCupMatchService.getCupCupMatch(cupCupMatchId, relations);
   }

   private getCupMatchesObservable(cupCupMatchId: number): Observable<PaginatedResponse<CupMatchNew>> {
      const search: CupMatchSearch = {
         cupCupMatchId,
         relations: ['match.clubHome', 'match.clubAway'],
         orderBy: 'started_at',
         sequence: Sequence.Ascending,
         limit: SettingsService.maxLimitValues.cupMatches,
         page: 1
      };
      return this.cupMatchService.getCupMatches(search);
   }

   private getCupPredictionsObservable(
      cupCupMatchId: number,
      homeUserId: number,
      awayUserId: number
   ): Observable<{ homePredictions: PaginatedResponse<CupPredictionNew>; awayPredictions: PaginatedResponse<CupPredictionNew> }> {
      const homeRequest =
         this.user && this.user.id === homeUserId
            ? this.cupPredictionService.getMyCupPredictions(cupCupMatchId)
            : this.cupPredictionService.getCupPredictions({ cupCupMatchId, userId: homeUserId });
      const awayRequest =
         this.user && this.user.id === awayUserId
            ? this.cupPredictionService.getMyCupPredictions(cupCupMatchId)
            : this.cupPredictionService.getCupPredictions({ cupCupMatchId, userId: awayUserId });

      const requests: [Observable<PaginatedResponse<CupPredictionNew>>, Observable<PaginatedResponse<CupPredictionNew>>] = [
         homeRequest,
         awayRequest
      ];
      return forkJoin(requests).pipe(
         map(([homePredictions, awayPredictions]) => {
            return { homePredictions, awayPredictions };
         })
      );
   }

   private getPageData(cupCupMatchId: number): void {
      const requests: [Observable<CupCupMatchNew>, Observable<PaginatedResponse<CupMatchNew>>] = [
         this.getCupCupMatchObservable(cupCupMatchId),
         this.getCupMatchesObservable(cupCupMatchId)
      ];
      forkJoin(requests)
         .pipe(
            map(([cupCupMatch, cupMatchesResponse]) => {
               return { cupCupMatch, cupMatchesResponse };
            }),
            tap(response => this.handleParentObservablesResult(response)),
            mergeMap(response =>
               this.getCupPredictionsObservable(cupCupMatchId, response.cupCupMatch.home_user_id, response.cupCupMatch.away_user_id)
            )
         )
         .subscribe(response => this.handlePredictionsObservableResult(response));
   }

   private handleParentObservablesResult(response: {
      cupCupMatch: CupCupMatchNew;
      cupMatchesResponse: PaginatedResponse<CupMatchNew>;
   }): void {
      this.cupCupMatch = response.cupCupMatch;
      this.cupMatches = response.cupMatchesResponse.data;
      this.titleService.setTitle(`${this.cupCupMatch.home_user.name} vs ${this.cupCupMatch.away_user.name} - Кубок`);
      this.cupCupMatchReadableResult = UtilsService.showScoresOrString(this.cupCupMatch.home, this.cupCupMatch.away, 'vs');
   }

   private handlePredictionsObservableResult(response: {
      homePredictions: PaginatedResponse<CupPredictionNew>;
      awayPredictions: PaginatedResponse<CupPredictionNew>;
   }): void {
      this.cupMatches.forEach(cupMatch => {
         this.predictionsNumber = { home: response.homePredictions.total, away: response.awayPredictions.total };
         const homePrediction = response.homePredictions.data.find(prediction => prediction.cup_match_id === cupMatch.id);
         const awayPrediction = response.awayPredictions.data.find(prediction => prediction.cup_match_id === cupMatch.id);
         this.matchesWithPredictions.push({
            matchInfo: { match: cupMatch, readable: UtilsService.showScoresOrString(cupMatch.match.home, cupMatch.match.away, 'vs') },
            homePredictionInfo: {
               prediction: homePrediction,
               readable: homePrediction ? UtilsService.showScoresOrString(homePrediction.home, homePrediction.away, '-') : null,
               scored: this.isCupMatchGuessed(cupMatch, homePrediction)
            },
            awayPredictionInfo: {
               prediction: awayPrediction,
               readable: awayPrediction ? UtilsService.showScoresOrString(awayPrediction.home, awayPrediction.away, '-') : null,
               scored: this.isCupMatchGuessed(cupMatch, awayPrediction)
            }
         });
      });
   }
}
