import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@env';
import { PaginatedResponse } from '@models/paginated-response.model';
import { CupGroupNumberSearch } from '@models/search/cup/cup-group-number-search.model';
import { Observable } from 'rxjs';

@Injectable()
export class CupGroupNumberNewService {
   public readonly cupGroupNumbersUrl: string = `${environment.apiBaseUrl}/v2/cup/group-numbers`;

   constructor(private httpClient: HttpClient) {}

   getCupGroupMatches(search: CupGroupNumberSearch): Observable<PaginatedResponse<number>> {
      const params: HttpParams = new HttpParams({ fromObject: { competition_id: search.competitionId.toString() } });
      return this.httpClient.get<PaginatedResponse<number>>(this.cupGroupNumbersUrl, { params });
   }
}
