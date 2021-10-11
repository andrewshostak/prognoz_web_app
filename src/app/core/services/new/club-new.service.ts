import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@env';
import { ClubNew } from '@models/new/club-new.model';
import { PaginatedResponse } from '@models/paginated-response.model';
import { ClubSearch } from '@models/search/club-search.model';
import { Observable } from 'rxjs';

@Injectable()
export class ClubNewService {
   public readonly clubsUrl: string = `${environment.apiUrl}v2/clubs`;

   constructor(private httpClient: HttpClient) {}

   public deleteClub(clubId: number): Observable<void> {
      return this.httpClient.delete<void>(`${this.clubsUrl}/${clubId}`);
   }

   public getClubs(search: ClubSearch): Observable<PaginatedResponse<ClubNew>> {
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

      if (search.parentId) {
         params = params.set('parent_id', search.parentId.toString());
      }

      if (search.search) {
         params = params.set('search', search.search);
      }

      if (search.type) {
         params = params.set('type', search.type);
      }

      if (search.relations) {
         search.relations.forEach(relation => {
            params = params.append('relations[]', relation);
         });
      }

      return this.httpClient.get<PaginatedResponse<ClubNew>>(this.clubsUrl, { params });
   }
}
