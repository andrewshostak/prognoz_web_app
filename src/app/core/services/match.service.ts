import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@env';
import { Match } from '@models/match.model';
import { PaginatedResponse } from '@models/paginated-response.model';
import { MatchSearch } from '@models/search/match-search.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class MatchService {
   public readonly matchesUrl: string = `${environment.apiUrl}matches`;

   constructor(private httpClient: HttpClient) {}

   public createMatch(match: Partial<Match>): Observable<Match> {
      return this.httpClient.post<{ match: Match }>(`${this.matchesUrl}`, match).pipe(map(response => response.match));
   }

   public deleteMatch(matchId: number): Observable<void> {
      return this.httpClient.delete<void>(`${this.matchesUrl}/${matchId}`);
   }

   public getMatches(matchSearch: MatchSearch): Observable<PaginatedResponse<Match>> {
      let params: HttpParams = new HttpParams();

      if (matchSearch.limit) {
         params = params.set('limit', matchSearch.limit.toString());
      }

      if (matchSearch.page) {
         params = params.set('page', matchSearch.page.toString());
      }

      if (matchSearch.order_by && matchSearch.sequence) {
         params = params.set('order_by', matchSearch.order_by);
         params = params.set('sequence', matchSearch.sequence);
      }

      return this.httpClient.get<PaginatedResponse<Match>>(this.matchesUrl, { params });
   }
}
