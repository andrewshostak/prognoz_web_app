import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { RouterMock } from '@mocks/router.mock';
import { AuthService } from '@services/auth.service';
import { ErrorHandlerService } from '@services/error-handler.service';
import { HeadersWithToken } from '@services/headers-with-token.service';

describe('AuthService', () => {
   let authService: AuthService;
   let errorHandlerService: {};
   let headersWithToken: {};
   let router: RouterMock;

   beforeEach(() => {
      TestBed.configureTestingModule({
         imports: [HttpClientTestingModule, RouterTestingModule],
         providers: [
            AuthService,
            { provide: Router, useClass: RouterMock },
            { provide: ErrorHandlerService, useValue: {} },
            { provide: HeadersWithToken, useValue: {} }
         ]
      });

      authService = TestBed.get(AuthService);
      router = TestBed.get(Router);
      errorHandlerService = TestBed.get(ErrorHandlerService);
      headersWithToken = TestBed.get(HeadersWithToken);
   });

   describe('#canActivate', () => {
      beforeEach(() => {
         localStorage.clear();
      });

      const falseAndNavigate: string = 'should return false and navigate to 403';

      it(falseAndNavigate + " if 'roles' value is not present in localStorage", () => {
         spyOn(router, 'navigate');
         expect(authService.canActivate(['aaa'])).toBeFalsy();
         expect(router.navigate).toHaveBeenCalledWith(['/403']);

         localStorage.setItem('auth_token', JSON.stringify(['bbb']));
         expect(authService.canActivate(['aaa'])).toBeFalsy();
         expect(router.navigate).toHaveBeenCalledWith(['/403']);
      });

      it(falseAndNavigate + " if 'auth_token' value is not present in localStorage", () => {
         spyOn(router, 'navigate');
         expect(authService.canActivate(['aaa'])).toBeFalsy();
         expect(router.navigate).toHaveBeenCalledWith(['/403']);

         localStorage.setItem('roles', JSON.stringify(['bbb']));
         expect(authService.canActivate(['aaa'])).toBeFalsy();
         expect(router.navigate).toHaveBeenCalledWith(['/403']);
      });

      it(falseAndNavigate + ' if roles from localStorage cannot be parsed', () => {
         localStorage.setItem('roles', 'kovbasa');
         localStorage.setItem('auth_token', 'token');
         spyOn(router, 'navigate');

         expect(authService.canActivate(['aaa'])).toBeFalsy();
         expect(router.navigate).toHaveBeenCalledWith(['/403']);
      });

      it(falseAndNavigate + ' if user has no roles', () => {
         localStorage.setItem('roles', JSON.stringify([]));
         localStorage.setItem('auth_token', 'token');
         spyOn(router, 'navigate');

         expect(authService.canActivate(['admin'])).toBeFalsy();
         expect(router.navigate).toHaveBeenCalledWith(['/403']);
      });

      it(falseAndNavigate + ' if user has different roles', () => {
         localStorage.setItem('roles', JSON.stringify(['match_editor']));
         localStorage.setItem('auth_token', 'token');
         spyOn(router, 'navigate');

         expect(authService.canActivate(['admin'])).toBeFalsy();
         expect(router.navigate).toHaveBeenCalledWith(['/403']);
      });

      it('should return true if user has at least one allowed role', () => {
         localStorage.setItem('roles', JSON.stringify(['match_editor']));
         localStorage.setItem('auth_token', 'token');
         spyOn(router, 'navigate');

         expect(authService.canActivate(['match_editor', 'admin'])).toBeTruthy();
         expect(router.navigate).not.toHaveBeenCalled();
      });
   });
});
