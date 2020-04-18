import { Injectable } from '@angular/core';

import { environment } from '@env';
import { User } from '@models/user.model';
import { ErrorHandlerService } from '@services/error-handler.service';
import { HeadersWithToken } from '@services/headers-with-token.service';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class UserService {
   private usersUrl = environment.apiUrl + 'users';
   constructor(private errorHandlerService: ErrorHandlerService, private headersWithToken: HeadersWithToken) {}

   /**
    * @deprecated use UserNewService
    */
   public updateUser(user: User): Observable<{ user: User }> {
      return this.headersWithToken.put(`${this.usersUrl}/${user.id}`, user).pipe(catchError(this.errorHandlerService.handle));
   }
}
