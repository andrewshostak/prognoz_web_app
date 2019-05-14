import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { AuthInterceptor } from '@app/auth.interceptor';
import { environment } from '@env';
import { MatchService } from '@services/match.service';

describe('AuthInterceptor', () => {
   let authInterceptor: AuthInterceptor;
   let exampleService: MatchService;
   let httpTestingController: HttpTestingController;
   let httpClient: HttpClient;

   beforeEach(() => {
      TestBed.configureTestingModule({
         imports: [HttpClientTestingModule],
         providers: [
            MatchService,
            {
               multi: true,
               provide: HTTP_INTERCEPTORS,
               useClass: AuthInterceptor
            },
            AuthInterceptor,
            HttpClient
         ]
      });

      authInterceptor = TestBed.get(AuthInterceptor);
      exampleService = TestBed.get(MatchService);
      httpTestingController = TestBed.get(HttpTestingController);
      httpClient = TestBed.get(HttpClient);
   });

   it('should have paths set', () => {
      expect(authInterceptor.paths).toContain('matches');
   });

   describe('#createHeaderValue', () => {
      it('should create authorization header value', () => {
         const authToken = 'bla-bla';
         expect(authInterceptor.createHeaderValue(authToken)).toEqual(`Bearer {${authToken}}`);
      });
   });

   /* tslint:disable:no-empty */
   describe('#intercept', () => {
      it('should add an Authorization header when auth token is present and isAllowedPath is true', () => {
         spyOn(localStorage, 'getItem').and.returnValue('i_am_auth_token');
         spyOn(authInterceptor, 'isAllowedPath').and.returnValue(true);

         exampleService.deleteMatch(900).subscribe(() => {});

         const httpRequest = httpTestingController.expectOne(exampleService.matchesUrl + '/900');

         expect(httpRequest.request.headers.has('Authorization')).toBeTruthy();
         expect(httpRequest.request.headers.get('Authorization')).toContain('i_am_auth_token');
      });

      it('should not add an Authorization header when auth token is present but isAllowedPath is false', () => {
         spyOn(localStorage, 'getItem').and.returnValue('i_am_awesome_auth_token');
         spyOn(authInterceptor, 'isAllowedPath').and.returnValue(false);

         httpClient.get(environment.apiUrl + 'seasons/89').subscribe(() => {});

         const httpRequest = httpTestingController.expectOne(environment.apiUrl + 'seasons/89');
         expect(httpRequest.request.headers.has('Authorization')).toBeFalsy();
      });

      it('should not add an Authorization header when auth token is absent but isAllowedPath is true', () => {
         spyOn(localStorage, 'getItem').and.returnValue(null);
         spyOn(authInterceptor, 'isAllowedPath').and.returnValue(true);

         exampleService.deleteMatch(900).subscribe(() => {});

         const httpRequest = httpTestingController.expectOne(exampleService.matchesUrl + '/900');

         expect(httpRequest.request.headers.has('Authorization')).toBeFalsy();
      });
   });

   describe('#isAllowedPath', () => {
      const fakeUrl: string = 'http://not-api-url.com';

      it('should return false when url does not include environment apiUrl and allowed paths', () => {
         expect(authInterceptor.isAllowedPath(`${fakeUrl}/zzz/aaa`)).toBeFalsy();
      });

      it('should return false when url includes environment apiUrl but not one of allowed paths', () => {
         expect(authInterceptor.isAllowedPath(`${environment.apiUrl}/sausage`)).toBeFalsy();
      });

      it('should return false when url includes one of allowed paths but does not environment apiUrl', () => {
         expect(authInterceptor.isAllowedPath(`${fakeUrl}/${authInterceptor.paths[0]}`)).toBeFalsy();
      });

      it('should return true when url includes one of allowed paths and environment apiUrl', () => {
         expect(authInterceptor.isAllowedPath(`${environment.apiUrl}/${authInterceptor.paths[0]}`)).toBeTruthy();
      });
   });
});
