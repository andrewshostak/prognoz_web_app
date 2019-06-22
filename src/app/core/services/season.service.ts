import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@env';
import { ErrorHandlerService } from '@services/error-handler.service';
import { HeadersWithToken } from '@services/headers-with-token.service';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class SeasonService {
   public seasonsUrl = environment.apiUrl + 'seasons';

   constructor(
      private errorHandlerService: ErrorHandlerService,
      private headersWithToken: HeadersWithToken,
      private httpClient: HttpClient
   ) {}

   /**
    * Get all seasons
    * @returns {Observable<any>}
    */
   public getSeasons(): Observable<any> {
      return this.httpClient.get<any>(this.seasonsUrl).pipe(catchError(this.errorHandlerService.handle));
   }
}
