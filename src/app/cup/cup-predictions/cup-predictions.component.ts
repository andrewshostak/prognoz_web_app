import { Component, OnInit } from '@angular/core';

import { Sequence } from '@enums/sequence.enum';
import { CupMatch } from '@models/v2/cup/cup-match.model';
import { CupPrediction } from '@models/v2/cup/cup-prediction.model';
import { User } from '@models/v2/user.model';
import { CupMatchSearch } from '@models/search/cup/cup-match-search.model';
import { CurrentStateService } from '@services/current-state.service';
import { AuthService } from '@services/v2/auth.service';
import { CupMatchService } from '@services/v2/cup-match.service';
import { CupPredictionService } from '@services/v2/cup-prediction.service';
import { SettingsService } from '@services/settings.service';
import { TitleService } from '@services/title.service';
import { get } from 'lodash';
import { Observable } from 'rxjs';
import { map, mergeMap, tap } from 'rxjs/operators';
import { MatchState } from '@enums/match-state.enum';

@Component({
   selector: 'app-cup-predictions',
   templateUrl: './cup-predictions.component.html',
   styleUrls: ['./cup-predictions.component.scss']
})
export class CupPredictionsComponent implements OnInit {
   constructor(
      private authService: AuthService,
      private cupMatchService: CupMatchService,
      private cupPredictionService: CupPredictionService,
      private currentStateService: CurrentStateService,
      private titleService: TitleService
   ) {}

   authenticatedUser: User;
   cupPredictions: CupPrediction[] = [];
   private cupMatches: CupMatch[];

   cupPredictionUpdated(event: {
      cupMatchId: number;
      cupPrediction?: CupPrediction;
      error?: { message: string; status_code: number };
   }): void {
      if (event.error && event.error.message.includes('Час для прогнозування вийшов')) {
         this.cupMatches = this.cupMatches.filter(cupMatch => cupMatch.id !== event.cupMatchId);
         this.cupPredictions = this.cupPredictions.filter(cupPrediction => cupPrediction.cup_match_id !== event.cupMatchId);
         return;
      }

      if (event.cupPrediction) {
         const cupPredictionIndex = this.cupPredictions.findIndex(cupPrediction => cupPrediction.cup_match_id === event.cupMatchId);
         if (cupPredictionIndex > -1) {
            this.cupPredictions[cupPredictionIndex] = { ...this.cupPredictions[cupPredictionIndex], ...event.cupPrediction };
         }
      }
   }

   ngOnInit() {
      this.titleService.setTitle('Зробити прогнози - Кубок');
      this.authenticatedUser = this.authService.getUser();
      if (this.authenticatedUser) {
         this.getPageData(this.authenticatedUser.id);
      }
   }

   private getPageData(userId: number): void {
      this.getCupMatches(userId)
         .pipe(
            map(cupMatches => cupMatches.filter(cupMatch => cupMatch.is_predictable)),
            tap(cupMatches => (this.cupMatches = cupMatches)),
            map(cupMatches =>
               cupMatches.filter(cupMatch => cupMatch.cup_stages && cupMatch.cup_stages[0] && cupMatch.cup_stages[0].cup_cup_matches)
            ),
            map(cupMatches =>
               cupMatches.reduce((acc, cupMatch) => {
                  const cupCupMatchIds = [];
                  cupMatch.cup_stages.forEach(cupStage => {
                     cupStage.cup_cup_matches.forEach(cupCupMatch => {
                        if (!acc.includes(cupCupMatch.id)) {
                           cupCupMatchIds.push(cupCupMatch.id);
                        }
                     });
                  });
                  return acc.concat(cupCupMatchIds);
               }, [])
            ),
            mergeMap(cupCupMatchIds => this.getCupPredictions(cupCupMatchIds)),
            tap(cupPredictions => (this.cupPredictions = this.linkCupMatchesAndPredictions(this.cupMatches, cupPredictions)))
         )
         .subscribe();
   }

   private getCupMatches(userId: number): Observable<CupMatch[]> {
      const search: CupMatchSearch = {
         userId,
         showPredictability: true,
         page: 1,
         limit: SettingsService.maxLimitValues.cupMatches,
         orderBy: 'started_at',
         sequence: Sequence.Ascending,
         relations: ['match.clubHome', 'match.clubAway'],
         states: [MatchState.Active]
      };
      return this.cupMatchService.getCupMatches(search).pipe(map(response => response.data));
   }

   private getCupPredictions(cupCupMatchIds: number[]): Observable<CupPrediction[]> {
      return this.cupPredictionService.getMyCupPredictions(cupCupMatchIds).pipe(map(response => response.data));
   }

   private linkCupMatchesAndPredictions(cupMatches: CupMatch[], cupPredictions: CupPrediction[]): CupPrediction[] {
      return cupMatches
         .filter(cupMatch => get(cupMatch, 'cup_stages[0].cup_cup_matches[0]'))
         .map(cupMatch => {
            let cupPrediction = cupPredictions.find(prediction => prediction.cup_match_id === cupMatch.id);
            if (!cupPrediction || !cupPrediction.id) {
               cupPrediction = {
                  home: null,
                  away: null,
                  user_id: this.authenticatedUser.id,
                  cup_match_id: cupMatch.id,
                  cup_cup_match_id: cupMatch.cup_stages[0].cup_cup_matches[0].id
               } as CupPrediction;
            }
            cupPrediction.cup_match = cupMatch;
            return cupPrediction;
         });
   }
}
