import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@env';
import { RequestParams } from '@models/request-params.model';
import { ErrorHandlerService } from '@services/error-handler.service';
import { HeadersWithToken } from '@services/headers-with-token.service';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class TeamMatchService {
   private teamMatchUrl = environment.apiUrl + 'team/matches';

   constructor(
      private errorHandlerService: ErrorHandlerService,
      private headersWithToken: HeadersWithToken,
      private httpClient: HttpClient
   ) {}

   /**
    * @deprecated
    * filter values: team-team-match
    */
   public getTeamMatches(requestParams?: RequestParams[]): Observable<any> {
      let params: HttpParams = new HttpParams();
      if (requestParams) {
         for (const requestParam of requestParams) {
            params = params.append(requestParam.parameter, requestParam.value);
         }
      }
      return this.httpClient.get(this.teamMatchUrl, { params }).pipe(catchError(this.errorHandlerService.handle));
   }

   /**
    * @deprecated
    * filter values: my, opponents
    */
   public getTeamMatchesAuthUser(requestParams: RequestParams[]): Observable<any> {
      let params: HttpParams = new HttpParams();
      const url = `${this.teamMatchUrl}-predictable`;
      for (const requestParam of requestParams) {
         params = params.append(requestParam.parameter, requestParam.value);
      }
      return this.headersWithToken.get(url, params).pipe(catchError(this.errorHandlerService.handle));
   }
}
