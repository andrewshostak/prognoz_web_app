import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@env';
import { Comment } from '@models/v2/comment.model';
import { PaginatedResponse } from '@models/paginated-response.model';
import { CommentSearch } from '@models/search/comment-search.model';
import { isNil } from 'lodash';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class CommentNewService {
   public readonly commentsUrl: string = `${environment.apiBaseUrl}/v2/comments`;

   constructor(private httpClient: HttpClient) {}

   public createComment(comment: Partial<Comment>): Observable<Comment> {
      return this.httpClient.post<{ comment: Comment }>(this.commentsUrl, comment).pipe(map(response => response.comment));
   }

   public deleteComment(id: number): Observable<void> {
      return this.httpClient.delete<void>(`${this.commentsUrl}/${id}`);
   }

   public getComments(search: CommentSearch): Observable<PaginatedResponse<Comment>> {
      let params: HttpParams = new HttpParams();

      if (!isNil(search.trashed)) {
         params = params.set('trashed', (search.trashed as unknown) as string);
      }

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

      if (search.newsId) {
         params = params.set('news_id', search.newsId.toString());
      }

      if (search.relations) {
         search.relations.forEach(relation => {
            params = params.append('relations[]', relation);
         });
      }

      return this.httpClient.get<PaginatedResponse<Comment>>(this.commentsUrl, { params });
   }

   public updateComment(id: number, comment: Partial<Comment>): Observable<Comment> {
      return this.httpClient.put<{ comment: Comment }>(`${this.commentsUrl}/${id}`, comment).pipe(map(response => response.comment));
   }
}
