import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Comment } from '@models/comment.model';
import { environment } from '@env';
import { ErrorHandlerService } from '@services/error-handler.service';
import { HeadersWithToken } from '@services/headers-with-token.service';

@Injectable()
export class CommentService {
    constructor(private errorHandlerService: ErrorHandlerService, private headersWithToken: HeadersWithToken) {}

    private commentUrl = environment.apiUrl + 'comment';

    /**
     * Add comment to news
     * @param comment
     * @returns {Observable<Comment>}
     */
    createComment(comment: Comment): Observable<Comment> {
        return this.headersWithToken
            .post(this.commentUrl, comment)
            .map(response => response['comment'])
            .catch(this.errorHandlerService.handle);
    }
}
