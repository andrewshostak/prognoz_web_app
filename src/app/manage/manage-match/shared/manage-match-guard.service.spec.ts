import { TestBed } from '@angular/core/testing';

import { ManageMatchGuard } from '@app/manage/manage-match/shared/manage-match-guard.service';
import { AuthServiceMock } from '@mocks/services/auth.service.mock';
import { AuthService } from '@services/auth.service';

describe('ManageMatchGuard', () => {
   let manageMatchGuard: ManageMatchGuard;
   let authService: AuthServiceMock;

   beforeEach(() => {
      TestBed.configureTestingModule({
         providers: [ManageMatchGuard, { provide: AuthService, useClass: AuthServiceMock }]
      });

      manageMatchGuard = TestBed.get(ManageMatchGuard);
      authService = TestBed.get(AuthService);
   });

   describe('#canActivate', () => {
      it('should invoke canActivate from AuthService', () => {
         const canActivate: boolean = true;
         spyOn(authService, 'canActivate').and.returnValue(canActivate);

         expect(manageMatchGuard.canActivate()).toEqual(canActivate);
         expect(authService.canActivate).toHaveBeenCalledWith(['admin', 'match_editor']);
      });
   });

   describe('#canActivateChild', () => {
      it('should invoke canActivate from AuthService', () => {
         const canActivate: boolean = false;
         spyOn(authService, 'canActivate').and.returnValue(canActivate);

         expect(manageMatchGuard.canActivate()).toEqual(canActivate);
         expect(authService.canActivate).toHaveBeenCalledWith(['admin', 'match_editor']);
      });
   });
});
