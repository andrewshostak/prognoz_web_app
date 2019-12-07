import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@env';
import { SettingsService } from '@services/settings.service';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
   public createHeaderValue(authToken: string): string {
      return `Bearer {${authToken}}`;
   }

   public intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      const authToken = localStorage.getItem('auth_token');

      if (authToken && this.isAllowedPath(httpRequest.url)) {
         httpRequest = httpRequest.clone({ headers: httpRequest.headers.set('Authorization', this.createHeaderValue(authToken)) });
      }

      return next.handle(httpRequest);
   }

   public isAllowedPath(url: string): boolean {
      return url.includes(environment.apiUrl) && SettingsService.newInterceptorPaths.some(path => url.includes(path));
   }
}
