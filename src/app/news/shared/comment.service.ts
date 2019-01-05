import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { catchError, map } from 'rxjs/operators';
import { Comment } from '@models/comment.model';
import { environment } from '@env';
import { ErrorHandlerService } from '@services/error-handler.service';
import { HeadersWithToken } from '@services/headers-with-token.service';
import { Observable } from 'rxjs';
import { RequestParams } from '@models/request-params.model';

@Injectable()
export class CommentService {
    constructor(
        private errorHandlerService: ErrorHandlerService,
        private headersWithToken: HeadersWithToken,
        private httpClient: HttpClient
    ) {}

    private commentUrl = environment.apiUrl + 'comments';

    /**
     * Get comments
     * @param {RequestParams[]} requestParams
     * @returns {Observable<Comment[]>}
     */
    getComments(requestParams?: RequestParams[]): Observable<Comment[]> {
        let params: HttpParams = new HttpParams();
        if (requestParams) {
            for (const requestParam of requestParams) {
                params = params.append(requestParam.parameter, requestParam.value);
            }
        }

        return this.httpClient.get(this.commentUrl, { params }).pipe(
            map(response => response['comments']),
            catchError(this.errorHandlerService.handle)
        );
    }

    /**
     * Add comment to news
     * @param comment
     * @returns {Observable<Comment>}
     */
    createComment(comment: Comment): Observable<Comment> {
        return this.headersWithToken.post(this.commentUrl, comment).pipe(
            map(response => response['comment']),
            catchError(this.errorHandlerService.handle)
        );
    }
}
