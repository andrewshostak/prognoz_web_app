import { Injectable } from '@angular/core';

import { CupStage } from '@models/cup/cup-stage.model';
import { ErrorHandlerService } from '@services/error-handler.service';
import { HeadersWithToken } from '@services/headers-with-token.service';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class CupStageService {
   private cupStageUrl = `${environment.apiUrl}cup/stages`;
   constructor(private errorHandlerService: ErrorHandlerService, private headersWithToken: HeadersWithToken) {}

   public updateCupStage(cupStage: CupStage, cupStageId: number): Observable<CupStage> {
      return this.headersWithToken.put(`${this.cupStageUrl}/${cupStageId}`, cupStage).pipe(
         map(response => response.cup_stage),
         catchError(this.errorHandlerService.handle)
      );
   }
}
