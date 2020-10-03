import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@env';
import { SeasonNew } from '@models/new/season-new.model';
import { PaginatedResponse } from '@models/paginated-response.model';
import { SeasonSearch } from '@models/search/season-search.model';
import { isNil } from 'lodash';
import { Observable } from 'rxjs';

@Injectable()
export class SeasonNewService {
   public readonly seasonsUrl: string = `${environment.apiUrl}v2/seasons`;

   constructor(private httpClient: HttpClient) {}

   public getSeasons(search: SeasonSearch): Observable<PaginatedResponse<SeasonNew>> {
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

      return this.httpClient.get<PaginatedResponse<SeasonNew>>(this.seasonsUrl, { params });
   }
}
