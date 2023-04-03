import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Sequence } from '@enums/sequence.enum';
import { environment } from '@env';
import { CupCupMatchNew } from '@models/new/cup-cup-match-new.model';
import { PaginatedResponse } from '@models/paginated-response.model';
import { CupCupMatchSearch } from '@models/search/cup-cup-match-search.model';
import { AuthNewService } from '@services/new/auth-new.service';
import { groupBy } from 'lodash';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class CupCupMatchNewService {
   public readonly cupCupMatchesUrl: string = `${environment.apiUrl}v2/cup/cup-matches`;

   constructor(private authService: AuthNewService, private httpClient: HttpClient) {}

   deleteCupCupMatch(cupCupMatchId: number): Observable<void> {
      return this.httpClient.delete<void>(`${this.cupCupMatchesUrl}/${cupCupMatchId}`);
   }

   public groupCupCupMatches(cupCupMatches: CupCupMatchNew[]): CupCupMatchNew[][] {
      const groupedCupCupMatches = Object.values(
         groupBy<CupCupMatchNew>(cupCupMatches, 'group_number') as {
            [groupNumber: number]: CupCupMatchNew[];
         }
      );

      const user = this.authService.getUser();
      if (!user) {
         return groupedCupCupMatches;
      }

      const userGroupIndex = groupedCupCupMatches.findIndex((ccMatches: CupCupMatchNew[]) =>
         ccMatches
            .map(cupCupMatch => [cupCupMatch.home_user_id, cupCupMatch.away_user_id])
            .flat()
            .includes(user.id)
      );

      if (userGroupIndex < 0) {
         return groupedCupCupMatches;
      }

      const userGroupCupCupMatches = groupedCupCupMatches.splice(userGroupIndex, 1).flat();
      const userGroupSortedCupCupMatches = this.sortCupCupMatchesByUserId(userGroupCupCupMatches, user.id);
      groupedCupCupMatches.unshift(userGroupSortedCupCupMatches);

      return groupedCupCupMatches;
   }

   public groupCupCupMatchesByStage(cupCupMatches: CupCupMatchNew[], sequence: Sequence): CupCupMatchNew[][] {
      return Object.values(
         groupBy<CupCupMatchNew>(cupCupMatches, 'cup_stage_id') as {
            [cupStageId: number]: CupCupMatchNew[];
         }
      ).sort((a, b) => {
         return sequence === Sequence.Ascending
            ? a[0].cup_stage_id > b[0].cup_stage_id
               ? 1
               : -1
            : a[0].cup_stage_id > b[0].cup_stage_id
            ? -1
            : 1;
      });
   }

   public sortCupCupMatches(cupCupMatches: CupCupMatchNew[]): CupCupMatchNew[] {
      const user = this.authService.getUser();
      if (!user) {
         return cupCupMatches.sort(this.sortByIdFunc);
      }

      return this.sortCupCupMatchesByUserId(cupCupMatches, user.id);
   }

   public getCupCupMatch(cupCupMatchId: number, relations: string[] = []): Observable<CupCupMatchNew> {
      const params = new HttpParams({ fromObject: { 'relations[]': relations } });
      return this.httpClient
         .get<{ cup_cup_match: CupCupMatchNew }>(`${this.cupCupMatchesUrl}/${cupCupMatchId}`, { params })
         .pipe(map(response => response.cup_cup_match));
   }

   public getCupCupMatches(search: CupCupMatchSearch): Observable<PaginatedResponse<CupCupMatchNew>> {
      let params: HttpParams = new HttpParams({ fromObject: { 'relations[]': search.relations || [] } });

      if (search.limit) {
         params = params.set('limit', search.limit.toString());
      }

      if (search.page) {
         params = params.set('page', search.page.toString());
      }

      if (search.orderBy && search.sequence) {
         params = params.set('order_by', search.orderBy);
         params = params.set('sequence', search.sequence);
      }

      if (search.cupStageId) {
         params = params.set('cup_stage_id', search.cupStageId.toString());
      }

      if (search.cupPredictionsCount) {
         params = params.append('cup_predictions_count', (search.cupPredictionsCount as unknown) as string);
      }

      if (search.groupNumber) {
         params = params.set('group_number', search.groupNumber.toString());
      }

      if (search.competitionId) {
         params = params.set('competition_id', search.competitionId.toString());
      }

      if (search.userId) {
         params = params.set('user_id', search.userId.toString());
      }

      if (search.states) {
         search.states.forEach(state => {
            params = params.append('states[]', state);
         });
      }

      return this.httpClient.get<PaginatedResponse<CupCupMatchNew>>(this.cupCupMatchesUrl, { params });
   }

   private sortByIdFunc(a: CupCupMatchNew, b: CupCupMatchNew): number {
      return a.id < b.id ? -1 : 1;
   }

   private sortCupCupMatchesByUserId(cupCupMatches: CupCupMatchNew[], userId: number): CupCupMatchNew[] {
      return cupCupMatches.sort((a, b) => {
         if ([a.home_user_id, a.away_user_id].includes(userId)) {
            return -1;
         }
         if ([b.home_user_id, b.away_user_id].includes(userId)) {
            return 1;
         }

         return this.sortByIdFunc(a, b);
      });
   }
}
