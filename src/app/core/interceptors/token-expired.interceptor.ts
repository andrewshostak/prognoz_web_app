import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Router } from '@angular/router';
import { Injectable, Injector } from '@angular/core';

import { AuthService } from '@services/api/v2/auth.service';
import { CurrentStateService } from '@services/current-state.service';
import { get } from 'lodash';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class TokenExpiredInterceptor implements HttpInterceptor {
   constructor(private injector: Injector) {}

   public intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      return next.handle(httpRequest).pipe(
         catchError((error: HttpErrorResponse) => {
            const errorObject = get(error, 'error');

            if (error.status === 401 && errorObject.message && errorObject.message === AuthService.tokenExpired) {
               const currentStateService = this.injector.get(CurrentStateService);
               currentStateService.setUser(null);
               currentStateService.getOnlineUsers(null);

               const router = this.injector.get(Router);
               router.navigate(['/signin']);
            }

            return throwError(error);
         })
      );
   }
}
