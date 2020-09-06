import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@env';
import { CupApplication } from '@models/cup/cup-application.model';
import { ErrorHandlerService } from '@services/error-handler.service';
import { HeadersWithToken } from '@services/headers-with-token.service';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class CupApplicationService {
   private cupApplicationUrl = environment.apiUrl + 'cup/applications';
   constructor(
      private errorHandlerService: ErrorHandlerService,
      private headersWithToken: HeadersWithToken,
      private httpClient: HttpClient
   ) {}

   public getCupApplications(): Observable<CupApplication[]> {
      return this.httpClient.get<{ cup_applications: CupApplication[] }>(this.cupApplicationUrl).pipe(
         map(response => response.cup_applications),
         catchError(this.errorHandlerService.handle)
      );
   }

   public updateCupApplication(cupApplication, cupApplicationId: number): Observable<CupApplication> {
      return this.headersWithToken
         .put(`${this.cupApplicationUrl}/${cupApplicationId}`, cupApplication)
         .pipe(catchError(this.errorHandlerService.handle));
   }

   public createCupApplication(
      cupApplication: CupApplication,
      deviceId?: string,
      deviceInfo?: { [key: string]: any }
   ): Observable<CupApplication> {
      if (deviceId && deviceInfo) {
         return this.headersWithToken
            .post(this.cupApplicationUrl, { ...cupApplication, deviceInfo }, { 'x-device-id': deviceId })
            .pipe(catchError(this.errorHandlerService.handle));
      }
      return this.headersWithToken.post(this.cupApplicationUrl, cupApplication).pipe(catchError(this.errorHandlerService.handle));
   }

   public deleteCupApplication(cupApplicationId: number): Observable<void> {
      return this.headersWithToken
         .delete(`${this.cupApplicationUrl}/${cupApplicationId}`)
         .pipe(catchError(this.errorHandlerService.handle));
   }
}
