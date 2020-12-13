import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Sequence } from '@enums/sequence.enum';
import { environment } from '@env';
import { SeasonNew } from '@models/new/season-new.model';
import { PaginatedResponse } from '@models/paginated-response.model';
import { SeasonSearch } from '@models/search/season-search.model';
import { SettingsService } from '@services/settings.service';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class SeasonNewService {
   public readonly seasonsUrl: string = `${environment.apiUrl}v2/seasons`;
   private seasons: SeasonNew[];

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

      if (search.state) {
         params = params.append('state', search.state);
      }

      const noSeasonsFilterParams = this.noSeasonsFilterParams(search);
      return this.seasons && noSeasonsFilterParams
         ? of({ data: this.seasons } as PaginatedResponse<SeasonNew>)
         : this.httpClient.get<PaginatedResponse<SeasonNew>>(this.seasonsUrl, { params }).pipe(
              tap(response => {
                 if (noSeasonsFilterParams) {
                    this.seasons = response.data;
                 }
              })
           );
   }

   private noSeasonsFilterParams(search: SeasonSearch): boolean {
      if (search.state) {
         return false;
      }

      if (search.sequence !== Sequence.Descending) {
         return false;
      }

      if (search.orderBy !== 'id') {
         return false;
      }

      return search.limit === SettingsService.maxLimitValues.seasons;
   }
}
