import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { catchError, map } from 'rxjs/operators';
import { environment } from '@env';
import { ErrorHandlerService } from '@services/error-handler.service';
import { HeadersWithToken } from '@services/headers-with-token.service';
import { News } from '@models/news.model';

@Injectable()
export class NewsService {
   constructor(private errorHandlerService: ErrorHandlerService, private headersWithToken: HeadersWithToken) {}

   private newsUrl = environment.apiUrl + 'news';

   /**
    * Delete one news item
    * @param id
    * @returns {Observable<void>}
    */
   deleteNewsItem(id: number): Observable<void> {
      return this.headersWithToken.delete(`${this.newsUrl}/${id}`).pipe(catchError(this.errorHandlerService.handle));
   }

   /**
    * Create one news item
    * @param news
    * @returns {Observable<News>}
    */
   createNewsItem(news: News): Observable<News> {
      return this.headersWithToken.post(this.newsUrl, news).pipe(
         map(response => response.news),
         catchError(this.errorHandlerService.handle)
      );
   }

   /**
    * Update one news item
    * @param news
    * @param newsId
    * @returns {Observable<News>}
    */
   updateNewsItem(news: News, newsId: number): Observable<News> {
      return this.headersWithToken.put(`${this.newsUrl}/${newsId}`, news).pipe(
         map(response => response.news),
         catchError(this.errorHandlerService.handle)
      );
   }
}
