import { Injectable } from '@angular/core';

import { environment } from '@env';
import { CupApplication } from '@models/cup/cup-application.model';
import { ErrorHandlerService } from '@services/error-handler.service';
import { HeadersWithToken } from '@services/headers-with-token.service';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class CupApplicationService {
   private cupApplicationUrl = environment.apiUrl + 'cup/applications';
   constructor(private errorHandlerService: ErrorHandlerService, private headersWithToken: HeadersWithToken) {}

   public updateCupApplication(cupApplication, cupApplicationId: number): Observable<{ cup_application: CupApplication }> {
      return this.headersWithToken
         .put(`${this.cupApplicationUrl}/${cupApplicationId}`, cupApplication)
         .pipe(catchError(this.errorHandlerService.handle));
   }
}
