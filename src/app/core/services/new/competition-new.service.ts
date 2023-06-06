import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@env';
import { CompetitionNew } from '@models/new/competition-new.model';
import { PaginatedResponse } from '@models/paginated-response.model';
import { CompetitionSearch } from '@models/search/competition-search.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class CompetitionNewService {
   public readonly competitionsUrl: string = `${environment.apiBaseUrl}/v2/competitions`;

   constructor(private httpClient: HttpClient) {}

   createCompetition(competition: Partial<CompetitionNew>): Observable<CompetitionNew> {
      return this.httpClient
         .post<{ competition: CompetitionNew }>(this.competitionsUrl, competition)
         .pipe(map(response => response.competition));
   }

   public getCompetition(id: number, relations: string[] = []): Observable<CompetitionNew> {
      const params = new HttpParams({ fromObject: { 'relations[]': relations } });
      return this.httpClient
         .get<{ competition: CompetitionNew }>(`${this.competitionsUrl}/${id}`, { params })
         .pipe(map(response => response.competition));
   }

   public getCompetitions(search: CompetitionSearch): Observable<PaginatedResponse<CompetitionNew>> {
      let params: HttpParams = new HttpParams();

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

      if (search.tournamentId) {
         params = params.set('tournament_id', (search.tournamentId as unknown) as string);
      }

      if (search.seasonId) {
         params = params.set('season_id', (search.seasonId as unknown) as string);
      }

      if (search.states) {
         search.states.forEach(state => {
            params = params.append('states[]', state);
         });
      }

      if (search.relations) {
         search.relations.forEach(relation => {
            params = params.append('relations[]', relation);
         });
      }

      return this.httpClient.get<PaginatedResponse<CompetitionNew>>(this.competitionsUrl, { params });
   }

   updateCompetition(id: number, competition: Partial<CompetitionNew>): Observable<CompetitionNew> {
      return this.httpClient
         .put<{ competition: CompetitionNew }>(`${this.competitionsUrl}/${id}`, competition)
         .pipe(map(response => response.competition));
   }
}
