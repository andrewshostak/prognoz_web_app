import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@env';
import { RequestParams } from '@models/request-params.model';
import { ErrorHandlerService } from '@services/error-handler.service';
import { HeadersWithToken } from '@services/headers-with-token.service';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class TeamParticipantService {
   private teamParticipantUrl = environment.apiUrl + 'team/participants';
   constructor(private errorHandlerService: ErrorHandlerService, private headersWithToken: HeadersWithToken) {}

   /**
    * @deprecated
    */
   public getCurrentTeamParticipants(requestParams: RequestParams[]): Observable<any> {
      let params: HttpParams = new HttpParams();
      for (const requestParam of requestParams) {
         params = params.append(requestParam.parameter, requestParam.value);
      }
      return this.headersWithToken.get(this.teamParticipantUrl, params).pipe(catchError(this.errorHandlerService.handle));
   }
}
