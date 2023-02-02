import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { CupApplicationDefaultState } from '@enums/cup-application-default-state.enum';
import { environment } from '@env';
import { CupApplicationNew } from '@models/new/cup-application-new.model';
import { CupApplicationSearch } from '@models/search/cup-application-search.model';
import { PaginatedResponse } from '@models/paginated-response.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class CupApplicationNewService {
   readonly cupApplicationsUrl: string = `${environment.apiUrl}v2/cup/applications`;

   constructor(private httpClient: HttpClient) {}

   createCupApplication(
      cupApplication: Partial<CupApplicationNew>,
      deviceId?: string,
      deviceInfo?: { [key: string]: any }
   ): Observable<CupApplicationNew> {
      if (deviceId && deviceInfo) {
         const httpOptions = { headers: new HttpHeaders({ 'x-device-id': deviceId }) };
         return this.httpClient
            .post<{ cup_application: CupApplicationNew }>(this.cupApplicationsUrl, { ...cupApplication, deviceInfo }, httpOptions)
            .pipe(map(response => response.cup_application));
      }

      return this.httpClient
         .post<{ cup_application: CupApplicationNew }>(this.cupApplicationsUrl, cupApplication)
         .pipe(map(response => response.cup_application));
   }

   deleteCupApplication(cupApplicationId: number): Observable<void> {
      return this.httpClient.delete<void>(`${this.cupApplicationsUrl}/${cupApplicationId}`);
   }

   getCupApplications(search: CupApplicationSearch): Observable<PaginatedResponse<CupApplicationNew>> {
      let params: HttpParams = new HttpParams();

      if (search.competitionId) {
         params = params.set('competition_id', search.competitionId.toString());
      }

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

      if (search.relations) {
         search.relations.forEach(relation => {
            params = params.append('relations[]', relation);
         });
      }

      return this.httpClient.get<PaginatedResponse<CupApplicationNew>>(this.cupApplicationsUrl, { params });
   }

   updateCupApplication(id: number, state: CupApplicationDefaultState): Observable<CupApplicationNew> {
      return this.httpClient
         .patch<{ cup_application: CupApplicationNew }>(`${this.cupApplicationsUrl}/${id}`, { state })
         .pipe(map(response => response.cup_application));
   }
}
