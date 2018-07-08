import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { environment } from '@env';
import { ErrorHandlerService } from '@services/error-handler.service';
import { HeadersWithToken } from '@services/headers-with-token.service';
import { News } from '@models/news.model';

@Injectable()
export class NewsService {
    constructor(
        private errorHandlerService: ErrorHandlerService,
        private headersWithToken: HeadersWithToken,
        private httpClient: HttpClient
    ) {}

    private newsUrl = environment.apiUrl + 'news';

    /**
     * Get all paginated news
     * @param page
     * @returns {Observable<any>}
     */
    getNews(page: number = 1): Observable<any> {
        const params = new HttpParams().set('page', page.toString());
        return this.httpClient.get(this.newsUrl, { params: params }).catch(this.errorHandlerService.handle);
    }

    /**
     * Get one news item
     * @param id
     * @returns {Observable<News>}
     */
    getNewsItem(id: number): Observable<News> {
        return this.httpClient
            .get(`${this.newsUrl}/${id}`)
            .map(response => response['news'])
            .catch(this.errorHandlerService.handle);
    }

    /**
     * Delete one news item
     * @param id
     * @returns {Observable<void>}
     */
    deleteNewsItem(id: number): Observable<void> {
        return this.headersWithToken.delete(`${this.newsUrl}/${id}`).catch(this.errorHandlerService.handle);
    }

    /**
     * Create one news item
     * @param news
     * @returns {Observable<News>}
     */
    createNewsItem(news: News): Observable<News> {
        return this.headersWithToken
            .post(this.newsUrl, news)
            .map(response => response['news'])
            .catch(this.errorHandlerService.handle);
    }

    /**
     * Update one news item
     * @param news
     * @returns {Observable<News>}
     */
    updateNewsItem(news: News): Observable<News> {
        return this.headersWithToken
            .put(`${this.newsUrl}/${news.id}`, news)
            .map(response => response['news'])
            .catch(this.errorHandlerService.handle);
    }
}
