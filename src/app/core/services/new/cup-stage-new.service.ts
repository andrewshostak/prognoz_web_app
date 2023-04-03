import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@env';
import { CupStageNew } from '@models/new/cup-stage-new.model';
import { PaginatedResponse } from '@models/paginated-response.model';
import { CupStageSearch } from '@models/search/cup-stage-search.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class CupStageNewService {
   public readonly cupStagesUrl: string = `${environment.apiUrl}v2/cup/stages`;

   constructor(private httpClient: HttpClient) {}

   createCupStage(cupStage: Partial<CupStageNew>, cupMatches?: { id: number }[]): Observable<CupStageNew> {
      return this.httpClient
         .post<{ cup_stage: CupStageNew }>(this.cupStagesUrl, { ...cupStage, cup_matches: cupMatches })
         .pipe(map(response => response.cup_stage));
   }

   public deleteCupStage(cupStageId: number): Observable<void> {
      return this.httpClient.delete<void>(`${this.cupStagesUrl}/${cupStageId}`);
   }

   public getCupStage(cupStageId: number, relations: string[] = []): Observable<CupStageNew> {
      const params = new HttpParams({ fromObject: { 'relations[]': relations } });
      return this.httpClient
         .get<{ cup_stage: CupStageNew }>(`${this.cupStagesUrl}/${cupStageId}`, { params })
         .pipe(map(response => response.cup_stage));
   }

   public getCupStages(search: CupStageSearch): Observable<PaginatedResponse<CupStageNew>> {
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

      if (search.competitionId) {
         params = params.set('competition_id', search.competitionId.toString());
      }

      if (search.relations) {
         search.relations.forEach(relation => {
            params = params.append('relations[]', relation);
         });
      }

      if (search.states) {
         search.states.forEach(state => {
            params = params.append('states[]', state);
         });
      }

      return this.httpClient.get<PaginatedResponse<CupStageNew>>(this.cupStagesUrl, { params });
   }

   updateCupStage(cupStageId: number, cupStage: Partial<CupStageNew>, cupMatches?: { id: number }[]): Observable<CupStageNew> {
      return this.httpClient
         .put<{ cup_stage: CupStageNew }>(
            `${this.cupStagesUrl}/${cupStageId}`,
            cupMatches ? { ...cupStage, cup_matches: cupMatches } : cupStage
         )
         .pipe(map(response => response.cup_stage));
   }
}
