import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ErrorInterceptor } from '@app/core/interceptors/error.interceptor';

import { environment } from '@env';
import { NotificationsServiceMock } from '@mocks/services/notifications.service.mock';
import { MatchService } from '@services/api/v2/match.service';
import { NotificationsService } from 'angular2-notifications';

describe('ErrorInterceptor', () => {
   let errorInterceptor: ErrorInterceptor;
   let exampleService: MatchService;
   let httpTestingController: HttpTestingController;
   let httpClient: HttpClient;
   let notificationsService: NotificationsServiceMock;

   beforeEach(() => {
      TestBed.configureTestingModule({
         imports: [HttpClientTestingModule],
         providers: [
            MatchService,
            {
               multi: true,
               provide: HTTP_INTERCEPTORS,
               useClass: ErrorInterceptor
            },
            ErrorInterceptor,
            HttpClient,
            { provide: NotificationsService, useClass: NotificationsServiceMock }
         ]
      });

      errorInterceptor = TestBed.inject(ErrorInterceptor);
      exampleService = TestBed.inject(MatchService);
      httpTestingController = TestBed.inject(HttpTestingController);
      httpClient = TestBed.inject(HttpClient);
      notificationsService = TestBed.inject(NotificationsService);
   });

   it('should have POST, PUT, DELETE methods', () => {
      expect(errorInterceptor.methods).toEqual(['POST', 'PUT', 'DELETE', 'PATCH']);
   });

   describe('#intercept', () => {
      const error = { status: 400, statusText: 'Bad request' };

      it('should not invoke notificationsService `error` when `isAllowedPath` returns false', () => {
         spyOn(notificationsService, 'error');

         httpClient.delete(environment.apiBaseUrl + '/kovbaska').subscribe(
            () => {},
            () => {}
         );
         httpTestingController.expectOne(environment.apiBaseUrl + '/kovbaska').flush({}, error);

         expect(notificationsService.error).not.toHaveBeenCalled();
      });

      it('should not invoke notificationsService `error` when `isAllowedMethod` returns false', () => {
         spyOn(notificationsService, 'error');

         httpClient.get(exampleService.matchesUrl).subscribe(
            () => {},
            () => {}
         );
         httpTestingController.expectOne(exampleService.matchesUrl).flush({}, error);

         expect(notificationsService.error).not.toHaveBeenCalled();
      });

      it('should invoke notificationsService `error` when `isAllowedPath` and `isAllowedMethod` are true', () => {
         spyOn(notificationsService, 'error');

         httpClient.delete(exampleService.matchesUrl).subscribe(
            () => {},
            () => {}
         );
         httpTestingController.expectOne(exampleService.matchesUrl).flush({}, error);

         expect(notificationsService.error).toHaveBeenCalledWith('Помилка 400', '{}', { timeOut: 0 });
      });

      it('should invoke notificationsService `error` with overwritten message when token is expired', () => {
         spyOn(notificationsService, 'error');

         httpClient.delete(exampleService.matchesUrl).subscribe(
            () => {},
            () => {}
         );
         httpTestingController
            .expectOne(exampleService.matchesUrl)
            .flush({ message: 'Token has expired' }, { status: 401, statusText: 'Unauthorized' });

         expect(notificationsService.error).toHaveBeenCalledWith(
            'Помилка 401',
            'Час дії токену закінчився. Виконайте вхід на сайт знову.',
            { timeOut: 0 }
         );
      });
   });

   describe('#isAllowedMethod', () => {
      it('should return false if method is not in the allowed-list', () => {
         expect(errorInterceptor.isAllowedMethod('PUK')).toBeFalsy();
         expect(errorInterceptor.isAllowedMethod('GET')).toBeFalsy();
         expect(errorInterceptor.isAllowedMethod('OPTIONS')).toBeFalsy();
      });

      it('should return true when method is in the allowed-list', () => {
         expect(errorInterceptor.isAllowedMethod('POST')).toBeTruthy();
         expect(errorInterceptor.isAllowedMethod('PUT')).toBeTruthy();
         expect(errorInterceptor.isAllowedMethod('DELETE')).toBeTruthy();
      });
   });

   describe('#isAllowedPath', () => {
      const fakeUrl: string = 'http://not-api-url.com';

      it('should return false when url does not include environment apiUrl and allowed paths', () => {
         expect(errorInterceptor.isAllowedPath(`${fakeUrl}/zzz/aaa`)).toBeFalsy();
      });

      it('should return false when url includes environment apiUrl but not one of allowed paths', () => {
         expect(errorInterceptor.isAllowedPath(`${environment.apiBaseUrl}/sausage`)).toBeFalsy();
      });

      it('should return false when url includes one of allowed paths but does not environment apiUrl', () => {
         expect(errorInterceptor.isAllowedPath(`${fakeUrl}/v2/auth/logout`)).toBeFalsy();
      });

      it('should return true when url includes one of allowed paths and environment apiUrl', () => {
         expect(errorInterceptor.isAllowedPath(`${environment.apiBaseUrl}/v2/auth/logout`)).toBeTruthy();
      });
   });
});
