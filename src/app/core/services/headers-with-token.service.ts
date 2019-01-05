import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class HeadersWithToken {
    constructor(private httpClient: HttpClient) {}

    /**
     * Send get request
     * @param url
     * @param params
     * @returns {Observable<Object>}
     */
    get(url, params?: HttpParams): Observable<any> {
        const headers = new HttpHeaders().set('Authorization', 'Bearer {' + localStorage.getItem('auth_token') + '}');
        return this.httpClient.get(url, { headers: headers, params: params ? params : null });
    }

    /**
     * Send post request
     * @param url
     * @param data
     * @returns {Observable<Object>}
     */
    post(url, data): Observable<any> {
        const headers = new HttpHeaders()
            .set('Authorization', 'Bearer {' + localStorage.getItem('auth_token') + '}')
            .set('Content-Type', 'application/json');
        return this.httpClient.post(url, data, { headers: headers });
    }

    /**
     * Send delete request
     * @param url
     * @returns {Observable<any>}
     */
    delete(url): Observable<any> {
        const headers = new HttpHeaders().set('Authorization', 'Bearer {' + localStorage.getItem('auth_token') + '}');
        return this.httpClient.delete(url, { headers: headers });
    }

    /**
     * Send put request
     * @param url
     * @param data
     * @returns {Observable<Object>}
     */
    put(url, data): Observable<any> {
        const headers = new HttpHeaders()
            .set('Authorization', 'Bearer {' + localStorage.getItem('auth_token') + '}')
            .set('Content-Type', 'application/json');
        return this.httpClient.put(url, data, { headers: headers });
    }
}
