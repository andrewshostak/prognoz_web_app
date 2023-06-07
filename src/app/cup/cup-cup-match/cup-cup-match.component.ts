import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { TimePipe } from '@app/shared/pipes/time.pipe';
import { CupCupMatchState } from '@enums/cup-cup-match-state.enum';
import { MatchState } from '@enums/match-state.enum';
import { Sequence } from '@enums/sequence.enum';
import { CupCupMatch } from '@models/v2/cup/cup-cup-match.model';
import { CupMatch } from '@models/v2/cup/cup-match.model';
import { CupPrediction } from '@models/v2/cup/cup-prediction.model';
import { User } from '@models/v2/user.model';
import { PaginatedResponse } from '@models/paginated-response.model';
import { CupMatchSearch } from '@models/search/cup/cup-match-search.model';
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
   public cupCupMatch: CupCupMatch;
   public cupCupMatchReadableResult: string;
   public cupCupMatchStates = CupCupMatchState;
   public matchesWithPredictions: {
      matchInfo: { match: CupMatch; readable: string };
      homePredictionInfo: { prediction: CupPrediction; readable: string; scored: boolean };
      awayPredictionInfo: { prediction: CupPrediction; readable: string; scored: boolean };
   }[] = [];
   public numberOfMatchesInStage = 8;
   public predictionsNumber = { home: 0, away: 0 };
   public user: User;

   private cupMatches: CupMatch[] = [];

   constructor(
      private activatedRoute: ActivatedRoute,
      private authService: AuthNewService,
      private cupCupMatchService: CupCupMatchNewService,
      private cupMatchService: CupMatchNewService,
      private cupPredictionService: CupPredictionNewService,
      private timePipe: TimePipe,
      private titleService: TitleService
   ) {}

   public isCupMatchGuessed(cupMatch: CupMatch, cupPrediction: CupPrediction): boolean {
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

   private getCupCupMatchObservable(cupCupMatchId: number): Observable<CupCupMatch> {
      const relations = ['homeUser', 'awayUser', 'cupStage.competition', 'cupStage.CupStageType'];
      return this.cupCupMatchService.getCupCupMatch(cupCupMatchId, relations);
   }

   private getCupMatchesObservable(cupCupMatchId: number): Observable<PaginatedResponse<CupMatch>> {
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
   ): Observable<{ homePredictions: PaginatedResponse<CupPrediction>; awayPredictions: PaginatedResponse<CupPrediction> }> {
      const homeRequest =
         this.user && this.user.id === homeUserId
            ? this.cupPredictionService.getMyCupPredictions([cupCupMatchId])
            : this.cupPredictionService.getCupPredictions({ cupCupMatchIds: [cupCupMatchId], userId: homeUserId });
      const awayRequest =
         this.user && this.user.id === awayUserId
            ? this.cupPredictionService.getMyCupPredictions([cupCupMatchId])
            : this.cupPredictionService.getCupPredictions({ cupCupMatchIds: [cupCupMatchId], userId: awayUserId });

      const requests: [Observable<PaginatedResponse<CupPrediction>>, Observable<PaginatedResponse<CupPrediction>>] = [
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
      const requests: [Observable<CupCupMatch>, Observable<PaginatedResponse<CupMatch>>] = [
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

   private handleParentObservablesResult(response: { cupCupMatch: CupCupMatch; cupMatchesResponse: PaginatedResponse<CupMatch> }): void {
      this.cupCupMatch = response.cupCupMatch;
      this.cupMatches = response.cupMatchesResponse.data;
      this.titleService.setTitle(`${this.cupCupMatch.home_user.name} vs ${this.cupCupMatch.away_user.name} - Кубок`);
      this.cupCupMatchReadableResult = UtilsService.showScoresOrString(this.cupCupMatch.home, this.cupCupMatch.away, 'vs');
   }

   private handlePredictionsObservableResult(response: {
      homePredictions: PaginatedResponse<CupPrediction>;
      awayPredictions: PaginatedResponse<CupPrediction>;
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
