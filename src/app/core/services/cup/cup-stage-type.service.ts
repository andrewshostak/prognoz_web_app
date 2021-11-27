import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { catchError, map } from 'rxjs/operators';
import { CupStageType } from '@models/cup/cup-stage-type.model';
import { environment } from '@env';
import { ErrorHandlerService } from '@services/error-handler.service';
import { Observable } from 'rxjs';

@Injectable()
export class CupStageTypeService {
   public static readonly numberOfMatchesInStage: number = 8;

   constructor(private errorHandlerService: ErrorHandlerService, private httpClient: HttpClient) {}

   private cupStageTypeUrl = `${environment.apiUrl}cup/stage-types`;

   /**
    * Get cup stage types
    * @returns {Observable<CupStageType[]>}
    */
   getCupStageTypes(): Observable<CupStageType[]> {
      return this.httpClient.get<{ cup_stage_types: CupStageType[] }>(this.cupStageTypeUrl).pipe(
         map(response => response.cup_stage_types),
         catchError(this.errorHandlerService.handle)
      );
   }
}
