import { Injectable } from '@angular/core';

import { catchError } from 'rxjs/operators';
import { ChampionshipPrediction } from '@models/championship/championship-prediction.model';
import { environment } from '@env';
import { ErrorHandlerService } from '@services/error-handler.service';
import { HeadersWithToken } from '@services/headers-with-token.service';
import { Observable } from 'rxjs';

@Injectable()
export class ChampionshipPredictionService {
   constructor(private errorHandlerService: ErrorHandlerService, private headersWithToken: HeadersWithToken) {}

   private championshipPredictionUrl = environment.apiUrl + 'championship/predictions';

   /**
    * Update championship predictions
    * @returns {Observable<any>}
    */
   updateChampionshipPredictions(championshipPredictions: ChampionshipPrediction[]): Observable<any> {
      return this.headersWithToken
         .put(this.championshipPredictionUrl, championshipPredictions)
         .pipe(catchError(this.errorHandlerService.handle));
   }
}
