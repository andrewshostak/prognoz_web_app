import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@env';
import { Match } from '@models/v2/match.model';
import { PaginatedResponse } from '@models/paginated-response.model';
import { MatchSearch } from '@models/search/match-search.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class MatchService {
   public readonly matchesUrl: string = `${environment.apiBaseUrl}/v2/matches`;

   constructor(private httpClient: HttpClient) {}

   public createMatch(match: Partial<Match>): Observable<Match> {
      return this.httpClient.post<{ match: Match }>(this.matchesUrl, match).pipe(map(response => response.match));
   }

   public deleteMatch(matchId: number): Observable<void> {
      return this.httpClient.delete<void>(`${this.matchesUrl}/${matchId}`);
   }

   public getMatch(matchId: number): Observable<Match> {
      return this.httpClient.get<{ match: Match }>(`${this.matchesUrl}/${matchId}`).pipe(map(response => response.match));
   }

   public getMatches(matchSearch: MatchSearch): Observable<PaginatedResponse<Match>> {
      let params: HttpParams = new HttpParams();

      if (matchSearch.states) {
         matchSearch.states.forEach(relation => {
            params = params.append('states[]', relation);
         });
      }

      if (matchSearch.limit) {
         params = params.set('limit', matchSearch.limit.toString());
      }

      if (matchSearch.page) {
         params = params.set('page', matchSearch.page.toString());
      }

      if (matchSearch.orderBy && matchSearch.sequence) {
         params = params.set('order_by', matchSearch.orderBy);
         params = params.set('sequence', matchSearch.sequence);
      }

      return this.httpClient.get<PaginatedResponse<Match>>(this.matchesUrl, { params });
   }

   public updateMatch(match: Partial<Match>): Observable<Match> {
      return this.httpClient.put<{ match: Match }>(`${this.matchesUrl}/${match.id}`, match).pipe(map(response => response.match));
   }
}
