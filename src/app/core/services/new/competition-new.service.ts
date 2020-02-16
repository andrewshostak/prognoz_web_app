import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@env';
import { CompetitionNew } from '@models/new/competition-new.model';
import { PaginatedResponse } from '@models/paginated-response.model';
import { CompetitionSearch } from '@models/search/competition-search.model';
import { isNil } from 'lodash';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class CompetitionNewService {
   public readonly competitionsUrl: string = `${environment.apiUrl}v2/competitions`;

   constructor(private httpClient: HttpClient) {}

   public getCompetition(id: number): Observable<CompetitionNew> {
      return this.httpClient
         .get<{ competition: CompetitionNew }>(`${this.competitionsUrl}/${id}`)
         .pipe(map(response => response.competition));
   }

   public getCompetitions(search: CompetitionSearch): Observable<PaginatedResponse<CompetitionNew>> {
      let params: HttpParams = new HttpParams();

      if (search.limit) {
         params = params.set('limit', search.limit.toString());
      }

      if (search.tournamentId) {
         params = params.set('tournament_id', (search.tournamentId as unknown) as string);
      }

      if (!isNil(search.active)) {
         params = params.append('active', (search.active as unknown) as string);
      }
      if (!isNil(search.ended)) {
         params = params.append('ended', (search.ended as unknown) as string);
      }

      return this.httpClient.get<PaginatedResponse<CompetitionNew>>(this.competitionsUrl, { params });
   }
}
