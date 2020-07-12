import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@env';
import { ChampionshipRating } from '@models/championship/championship-rating.model';
import { RequestParams } from '@models/request-params.model';
import { ErrorHandlerService } from '@services/error-handler.service';
import { HeadersWithToken } from '@services/headers-with-token.service';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class ChampionshipRatingService {
   private championshipRatingUrl = environment.apiUrl + 'championship/rating';

   constructor(
      private errorHandlerService: ErrorHandlerService,
      private headersWithToken: HeadersWithToken,
      private httpClient: HttpClient
   ) {}

   public getChampionshipRatingItems(requestParams?: RequestParams[]): Observable<any> {
      let params: HttpParams = new HttpParams();
      if (requestParams) {
         for (const requestParam of requestParams) {
            params = params.append(requestParam.parameter, requestParam.value);
         }
      }
      return this.httpClient.get(this.championshipRatingUrl, { params }).pipe(catchError(this.errorHandlerService.handle));
   }

   public getChampionshipRatingItem(userId: number, competitionId?: number): Observable<ChampionshipRating> {
      let params: HttpParams = new HttpParams();
      if (competitionId) {
         params = params.append('competition_id', competitionId.toString());
      }
      return this.httpClient.get(`${this.championshipRatingUrl}/${userId}`, { params }).pipe(
         // tslint:disable-next-line:no-string-literal
         map(response => response['championship_rating']),
         catchError(this.errorHandlerService.handle)
      );
   }
}
