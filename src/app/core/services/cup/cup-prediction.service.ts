import { Injectable } from '@angular/core';

import { environment } from '@env';
import { CupPrediction } from '@models/cup/cup-prediction.model';
import { ErrorHandlerService } from '@services/error-handler.service';
import { HeadersWithToken } from '@services/headers-with-token.service';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class CupPredictionService {
   private cupPredictionUrl = `${environment.apiUrl}cup/predictions`;

   constructor(private errorHandlerService: ErrorHandlerService, private headersWithToken: HeadersWithToken) {}

   public updateCupPrediction(cupPrediction: CupPrediction): Observable<CupPrediction> {
      return this.headersWithToken.put(this.cupPredictionUrl, cupPrediction).pipe(
         map(response => response.cup_prediction),
         catchError(this.errorHandlerService.handle)
      );
   }
}
