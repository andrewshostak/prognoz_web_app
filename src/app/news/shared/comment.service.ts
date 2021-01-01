import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { catchError, map } from 'rxjs/operators';
import { Comment } from '@models/comment.model';
import { environment } from '@env';
import { ErrorHandlerService } from '@services/error-handler.service';
import { Observable } from 'rxjs';
import { RequestParams } from '@models/request-params.model';

@Injectable()
/**
 * @deprecated
 */
export class CommentService {
   constructor(private errorHandlerService: ErrorHandlerService, private httpClient: HttpClient) {}

   private commentUrl = environment.apiUrl + 'comments';

   /**
    * @deprecated
    */
   getComments(requestParams?: RequestParams[]): Observable<Comment[]> {
      let params: HttpParams = new HttpParams();
      if (requestParams) {
         for (const requestParam of requestParams) {
            params = params.append(requestParam.parameter, requestParam.value);
         }
      }

      return this.httpClient
         .get<{ comments: Comment[] }>(this.commentUrl, { params })
         .pipe(
            map(response => response.comments),
            catchError(this.errorHandlerService.handle)
         );
   }
}
