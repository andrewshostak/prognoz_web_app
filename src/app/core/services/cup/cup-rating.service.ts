import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { catchError } from 'rxjs/operators';
import { CupRating } from '@models/cup/cup-rating.model';
import { CupRatingGroup } from '@models/cup/cup-rating-group.model';
import { ErrorHandlerService } from '@services/error-handler.service';
import { environment } from '@env';

@Injectable()
export class CupRatingService {
   constructor(private errorHandlerService: ErrorHandlerService, private httpClient: HttpClient) {}

   private cupRatingUrl = environment.apiUrl + 'cup/rating';

   /**
    * Get user cup rating
    * @param {number} userId
    * @returns {Observable<CupRating>}
    */
   getCupRatingUser(userId: number): Observable<CupRating> {
      return this.httpClient.get<CupRating>(`${this.cupRatingUrl}/${userId}`).pipe(catchError(this.errorHandlerService.handle));
   }

   /**
    * Get group rating
    * @param {number} competitionId
    * @param {number} groupNumber
    * @returns {Observable<CupRatingGroup[]>}
    */
   getCupRatingGroup(competitionId: number, groupNumber: number): Observable<CupRatingGroup[]> {
      return this.httpClient
         .get<CupRatingGroup[]>(`${environment.apiUrl}cup/${competitionId}/rating-group/${groupNumber}`)
         .pipe(catchError(this.errorHandlerService.handle));
   }

   /**
    * Get list of groups
    * @param {number} competitionId
    * @returns {Observable<string[]>}
    */
   getCupRatingGroups(competitionId: number): Observable<number[]> {
      return this.httpClient
         .get<number[]>(`${environment.apiUrl}cup/${competitionId}/rating-group`)
         .pipe(catchError(this.errorHandlerService.handle));
   }
}
