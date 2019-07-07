import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@env';
import { RequestParams } from '@models/request-params.model';
import { ErrorHandlerService } from '@services/error-handler.service';
import { HeadersWithToken } from '@services/headers-with-token.service';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ChampionshipMatchService {
   private championshipMatchUrl = environment.apiUrl + 'championship/matches';

   constructor(
      private errorHandlerService: ErrorHandlerService,
      private headersWithToken: HeadersWithToken,
      private httpClient: HttpClient
   ) {}

   /**
    * Get match info
    * @param id
    * @param requestParams
    * @returns {Observable<any>}
    */
   public getChampionshipMatch(id: number, requestParams?: RequestParams[]): Observable<any> {
      let params: HttpParams = new HttpParams();
      if (requestParams) {
         for (const requestParam of requestParams) {
            params = params.append(requestParam.parameter, requestParam.value);
         }
      }
      return this.httpClient.get(`${this.championshipMatchUrl}/${id}`, { params }).pipe(catchError(this.errorHandlerService.handle));
   }

   /**
    * Get championship matches
    * @param requestParams
    * @returns {Observable<any>}
    */
   public getChampionshipMatches(requestParams?: RequestParams[]): Observable<any> {
      let params: HttpParams = new HttpParams();
      if (requestParams) {
         for (const requestParam of requestParams) {
            params = params.append(requestParam.parameter, requestParam.value);
         }
      }
      return this.httpClient.get(this.championshipMatchUrl, { params }).pipe(catchError(this.errorHandlerService.handle));
   }
}
