import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@env';
import { CupCupMatch } from '@models/v2/cup/cup-cup-match.model';
import { PaginatedResponse } from '@models/paginated-response.model';
import { CupCupMatchSearch } from '@models/search/cup/cup-cup-match-search.model';
import { AuthService } from '@services/api/v2/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class CupCupMatchService {
   public readonly cupCupMatchesUrl: string = `${environment.apiBaseUrl}/v2/cup/cup-matches`;

   constructor(private authService: AuthService, private httpClient: HttpClient) {}

   createCupCupMatch(cupCupMatch: Partial<CupCupMatch>): Observable<CupCupMatch> {
      return this.httpClient
         .post<{ cup_cup_match: CupCupMatch }>(this.cupCupMatchesUrl, cupCupMatch)
         .pipe(map(response => response.cup_cup_match));
   }

   createCupCupMatches(cupStageId: number, numberOfMatchesInFirstStage: number | null): Observable<void> {
      const body = { cup_stage_id: cupStageId, number_of_matches_in_first_stage: numberOfMatchesInFirstStage };
      return this.httpClient.post<void>(`${this.cupCupMatchesUrl}/generate`, body);
   }

   deleteCupCupMatch(cupCupMatchId: number): Observable<void> {
      return this.httpClient.delete<void>(`${this.cupCupMatchesUrl}/${cupCupMatchId}`);
   }

   public getCupCupMatch(cupCupMatchId: number, relations: string[] = []): Observable<CupCupMatch> {
      const params = new HttpParams({ fromObject: { 'relations[]': relations } });
      return this.httpClient
         .get<{ cup_cup_match: CupCupMatch }>(`${this.cupCupMatchesUrl}/${cupCupMatchId}`, { params })
         .pipe(map(response => response.cup_cup_match));
   }

   public getCupCupMatches(search: CupCupMatchSearch): Observable<PaginatedResponse<CupCupMatch>> {
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

      return this.httpClient.get<PaginatedResponse<CupCupMatch>>(this.cupCupMatchesUrl, { params });
   }

   updateCupCupMatch(id: number, cupCupMatch: Partial<CupCupMatch>): Observable<CupCupMatch> {
      return this.httpClient
         .put<{ cup_cup_match: CupCupMatch }>(`${this.cupCupMatchesUrl}/${id}`, cupCupMatch)
         .pipe(map(response => response.cup_cup_match));
   }
}
