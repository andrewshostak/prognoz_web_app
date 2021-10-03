import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { catchError, map } from 'rxjs/operators';
import { Club } from '@models/club.model';
import { environment } from '@env';
import { ErrorHandlerService } from '@services/error-handler.service';
import { HeadersWithToken } from '@services/headers-with-token.service';
import { Observable } from 'rxjs';

@Injectable()
export class ClubService {
   constructor(
      private errorHandlerService: ErrorHandlerService,
      private headersWithToken: HeadersWithToken,
      private httpClient: HttpClient
   ) {}

   private clubUrl = environment.apiUrl + 'clubs';

   /**
    * Get one club data
    * @param id
    * @returns {Observable<Club>}
    */
   getClub(id: number): Observable<Club> {
      return this.httpClient.get<{ club: Club }>(`${this.clubUrl}/${id}`).pipe(
         map(response => response.club),
         catchError(this.errorHandlerService.handle)
      );
   }

   /**
    * Create club
    * @param club
    * @returns {Observable<Club>}
    */
   createClub(club: Club): Observable<Club> {
      return this.headersWithToken.post(this.clubUrl, club).pipe(
         map(response => response.club),
         catchError(this.errorHandlerService.handle)
      );
   }

   /**
    * Delete club
    * @param id
    * @returns {Observable<void>}
    */
   deleteClub(id: number): Observable<void> {
      return this.headersWithToken.delete(`${this.clubUrl}/${id}`).pipe(catchError(this.errorHandlerService.handle));
   }

   /**
    * Update club
    * @param club
    * @returns {Observable<Club>}
    */
   updateClub(club: Club): Observable<Club> {
      return this.headersWithToken.put(`${this.clubUrl}/${club.id}`, club).pipe(
         map(response => response.club),
         catchError(this.errorHandlerService.handle)
      );
   }
}
