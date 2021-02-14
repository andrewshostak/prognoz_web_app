import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@env';
import { CupStageNew } from '@models/new/cup-stage-new';
import { PaginatedResponse } from '@models/paginated-response.model';
import { CupStageSearch } from '@models/search/cup-stage-search.model';
import { isNil } from 'lodash';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class CupStageNewService {
   public readonly cupStagesUrl: string = `${environment.apiUrl}v2/cup/stages`;

   constructor(private httpClient: HttpClient) {}

   public getCupStage(cupStageId: number): Observable<CupStageNew> {
      return this.httpClient
         .get<{ cup_stage: CupStageNew }>(`${this.cupStagesUrl}/${cupStageId}`)
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

      if (!isNil(search.active)) {
         params = params.append('active', (search.active as unknown) as string);
      }

      if (!isNil(search.ended)) {
         params = params.append('ended', (search.ended as unknown) as string);
      }

      if (search.competitionId) {
         params = params.set('competition_id', search.competitionId.toString());
      }

      if (search.relations) {
         search.relations.forEach(relation => {
            params = params.append('relations[]', relation);
         });
      }

      return this.httpClient.get<PaginatedResponse<CupStageNew>>(this.cupStagesUrl, { params });
   }
}
