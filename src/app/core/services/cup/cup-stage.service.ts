import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { CupStage } from '@models/cup/cup-stage.model';
import { ErrorHandlerService } from '@services/error-handler.service';
import { HeadersWithToken } from '@services/headers-with-token.service';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { isNil } from 'lodash';

@Injectable()
export class CupStageService {
   private cupStageUrl = `${environment.apiUrl}cup/stages`;
   constructor(
      private errorHandlerService: ErrorHandlerService,
      private headersWithToken: HeadersWithToken,
      private httpClient: HttpClient
   ) {}

   /**
    * @deprecated
    */
   public getCupStages(page?: number, active?: boolean, ended?: boolean, competitionId?: number): Observable<any> {
      let params = new HttpParams();
      if (page) {
         params = params.append('page', page.toString());
      }
      if (!isNil(active)) {
         params = params.append('active', active ? '1' : '0');
      }
      if (!isNil(ended)) {
         params = params.append('ended', ended ? '1' : '0');
      }
      if (!isNil(competitionId)) {
         params = params.append('competition_id', competitionId.toString());
      }
      return this.httpClient.get(this.cupStageUrl, { params }).pipe(catchError(this.errorHandlerService.handle));
   }

   /**
    * @deprecated
    */
   public getCupStage(cupStageId: number): Observable<CupStage> {
      return this.httpClient.get<{ cup_stage: CupStage }>(`${this.cupStageUrl}/${cupStageId}`).pipe(
         map(response => response.cup_stage),
         catchError(this.errorHandlerService.handle)
      );
   }

   public createCupStage(cupStage: CupStage): Observable<CupStage> {
      return this.headersWithToken.post(this.cupStageUrl, cupStage).pipe(
         map(response => response.cup_stage),
         catchError(this.errorHandlerService.handle)
      );
   }

   public updateCupStage(cupStage: CupStage, cupStageId: number): Observable<CupStage> {
      return this.headersWithToken.put(`${this.cupStageUrl}/${cupStageId}`, cupStage).pipe(
         map(response => response.cup_stage),
         catchError(this.errorHandlerService.handle)
      );
   }

   public deleteCupStage(cupStageId: number): Observable<void> {
      return this.headersWithToken.delete(`${this.cupStageUrl}/${cupStageId}`).pipe(catchError(this.errorHandlerService.handle));
   }
}
