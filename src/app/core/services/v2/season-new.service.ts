import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Sequence } from '@enums/sequence.enum';
import { environment } from '@env';
import { Season } from '@models/v2/season.model';
import { PaginatedResponse } from '@models/paginated-response.model';
import { SeasonSearch } from '@models/search/season-search.model';
import { SettingsService } from '@services/settings.service';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class SeasonNewService {
   public readonly seasonsUrl: string = `${environment.apiBaseUrl}/v2/seasons`;
   private seasons: Season[];

   constructor(private httpClient: HttpClient) {}

   public getSeasons(search: SeasonSearch): Observable<PaginatedResponse<Season>> {
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

      if (search.states) {
         search.states.forEach(relation => {
            params = params.append('states[]', relation);
         });
      }

      const noSeasonsFilterParams = this.noSeasonsFilterParams(search);
      return this.seasons && noSeasonsFilterParams
         ? of({ data: this.seasons } as PaginatedResponse<Season>)
         : this.httpClient
              .get<PaginatedResponse<Season>>(this.seasonsUrl, { params })
              .pipe(
                 tap(response => {
                    if (noSeasonsFilterParams) {
                       this.seasons = response.data;
                    }
                 })
              );
   }

   private noSeasonsFilterParams(search: SeasonSearch): boolean {
      if (search.states && search.states.length) {
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
