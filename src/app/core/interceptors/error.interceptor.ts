import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';

import { AuthService } from '@services/api/v2/auth.service';
import { environment } from '@env';
import { NotificationsService } from 'angular2-notifications';
import { get } from 'lodash';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
   public methods: string[] = ['POST', 'PUT', 'DELETE'];

   constructor(private injector: Injector) {}

   public intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      return next.handle(httpRequest).pipe(
         catchError((error: HttpErrorResponse) => {
            if (!this.isAllowedPath(httpRequest.url)) {
               return throwError(error);
            }

            let errorMessage: string;
            const errorObject = get(error, 'error');

            if (!this.isAllowedMethod(httpRequest.method) && !this.isTokenExpiredError(error.status, errorObject)) {
               return throwError(error);
            }

            if (error.status === 422) {
               const errorMessages = [];
               Object.keys(errorObject.errors).forEach(key => {
                  errorMessages.push(errorObject.errors[key]);
               });
               errorMessage = errorMessages.join(', ');
            } else if (this.isTokenExpiredError(error.status, errorObject)) {
               errorMessage = 'Час дії токену закінчився. Виконайте вхід на сайт знову.';
            } else {
               errorMessage = errorObject.message || JSON.stringify(errorObject);
            }

            const notificationsService = this.injector.get(NotificationsService);
            notificationsService.error('Помилка ' + error.status, errorMessage, { timeOut: 0 });

            return throwError(error);
         })
      );
   }

   public isAllowedMethod(method: string): boolean {
      return this.methods.some(m => m === method);
   }

   public isAllowedPath(url: string): boolean {
      return url.includes(environment.apiBaseUrl) && url.includes('v2');
   }

   public isTokenExpiredError(status: number, errorObject: any): boolean {
      return status === 401 && errorObject.message && errorObject.message === AuthService.tokenExpired;
   }
}
