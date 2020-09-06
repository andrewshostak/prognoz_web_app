import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

@Injectable()
export class HeadersWithToken {
   constructor(private httpClient: HttpClient) {}

   public get(url, params?: HttpParams): Observable<any> {
      const headers = new HttpHeaders().set('Authorization', 'Bearer {' + localStorage.getItem('auth_token') + '}');
      return this.httpClient.get(url, { headers, params: params ? params : null });
   }

   public post(url, data, additionalHeaders?: { [name: string]: string }): Observable<any> {
      let headers = new HttpHeaders()
         .set('Authorization', 'Bearer {' + localStorage.getItem('auth_token') + '}')
         .set('Content-Type', 'application/json');

      if (additionalHeaders) {
         Object.entries(additionalHeaders).forEach(([header, value]) => {
            headers = headers.set(header, value);
         });
      }
      return this.httpClient.post(url, data, { headers });
   }

   public delete(url): Observable<any> {
      const headers = new HttpHeaders().set('Authorization', 'Bearer {' + localStorage.getItem('auth_token') + '}');
      return this.httpClient.delete(url, { headers });
   }

   public put(url, data): Observable<any> {
      const headers = new HttpHeaders()
         .set('Authorization', 'Bearer {' + localStorage.getItem('auth_token') + '}')
         .set('Content-Type', 'application/json');
      return this.httpClient.put(url, data, { headers });
   }
}
