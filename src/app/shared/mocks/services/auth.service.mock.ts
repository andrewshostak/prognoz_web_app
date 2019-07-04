export class AuthServiceMock {
   public canActivate(roles: string[]): boolean {
      return false;
   }
}
