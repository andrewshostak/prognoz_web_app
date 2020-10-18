import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@env';
import { CupCupMatchNew } from '@models/new/cup-cup-match-new.model';
import { PaginatedResponse } from '@models/paginated-response.model';
import { CupCupMatchSearch } from '@models/search/cup-cup-match-search.model';
import { AuthNewService } from '@services/new/auth-new.service';
import { groupBy, isNil } from 'lodash';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class CupCupMatchNewService {
   public readonly cupCupMatchesUrl: string = `${environment.apiUrl}v2/cup/cup-matches`;

   constructor(private authService: AuthNewService, private httpClient: HttpClient) {}

   public groupCupCupMatches(cupCupMatches: CupCupMatchNew[]): CupCupMatchNew[][] {
      const groupedCupCupMatches = Object.values(groupBy<CupCupMatchNew>(cupCupMatches, 'group_number') as {
         [groupNumber: number]: CupCupMatchNew[];
      });

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

   public sortCupCupMatches(cupCupMatches: CupCupMatchNew[]): CupCupMatchNew[] {
      const user = this.authService.getUser();
      if (!user) {
         return cupCupMatches;
      }

      return this.sortCupCupMatchesByUserId(cupCupMatches, user.id);
   }

   public getCupCupMatch(cupCupMatchId: number): Observable<CupCupMatchNew> {
      return this.httpClient
         .get<{ cup_cup_match: CupCupMatchNew }>(`${this.cupCupMatchesUrl}/${cupCupMatchId}`)
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

      if (!isNil(search.active)) {
         params = params.append('active', (search.active as unknown) as string);
      }

      if (!isNil(search.ended)) {
         params = params.append('ended', (search.ended as unknown) as string);
      }

      if (search.cupStageId) {
         params = params.set('cup_stage_id', search.cupStageId.toString());
      }

      return this.httpClient.get<PaginatedResponse<CupCupMatchNew>>(this.cupCupMatchesUrl, { params });
   }

   private sortCupCupMatchesByUserId(cupCupMatches: CupCupMatchNew[], userId: number): CupCupMatchNew[] {
      return cupCupMatches.sort((a, b) => {
         if ([a.home_user_id, a.away_user_id].includes(userId)) {
            return -1;
         }
         if ([b.home_user_id, b.away_user_id].includes(userId)) {
            return 1;
         }

         return 0;
      });
   }
}
