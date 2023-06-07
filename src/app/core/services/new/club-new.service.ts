import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@env';
import { ClubNew } from '@models/v2/club-new.model';
import { PaginatedResponse } from '@models/paginated-response.model';
import { ClubSearch } from '@models/search/club-search.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { serialize } from 'object-to-formdata';

@Injectable()
export class ClubNewService {
   public readonly clubsUrl: string = `${environment.apiBaseUrl}/v2/clubs`;

   constructor(private httpClient: HttpClient) {}

   public createClub(club: Partial<ClubNew>): Observable<ClubNew> {
      const body = serialize(club, { indices: true, nullsAsUndefineds: true });
      return this.httpClient.post<{ club: ClubNew }>(this.clubsUrl, body).pipe(map(response => response.club));
   }

   public deleteClub(clubId: number): Observable<void> {
      return this.httpClient.delete<void>(`${this.clubsUrl}/${clubId}`);
   }

   public getClub(clubId: number, relations: string[] = []): Observable<ClubNew> {
      const params = new HttpParams({ fromObject: { 'relations[]': relations } });
      return this.httpClient
         .get<{ club: ClubNew }>(`${this.clubsUrl}/${clubId}`, { params })
         .pipe(map(response => response.club));
   }

   public getClubs(search: ClubSearch): Observable<PaginatedResponse<ClubNew>> {
      let params: HttpParams = new HttpParams();

      if (search.limit) {
         params = params.set('limit', search.limit.toString());
      }

      if (search.page) {
         params = params.set('page', search.page.toString());
      }

      if (search.orderBy && search.sequence) {
         params = params.set('order_by', search.orderBy);
         params = params.set('sequence', search.sequence);
      }

      if (search.parentId) {
         params = params.set('parent_id', search.parentId.toString());
      }

      if (search.search) {
         params = params.set('search', search.search);
      }

      if (search.type) {
         params = params.set('type', search.type);
      }

      if (search.relations) {
         search.relations.forEach(relation => {
            params = params.append('relations[]', relation);
         });
      }

      return this.httpClient.get<PaginatedResponse<ClubNew>>(this.clubsUrl, { params });
   }

   public updateClub(clubId: number, club: Partial<ClubNew>): Observable<ClubNew> {
      const body = club.image ? serialize(club, { indices: true, nullsAsUndefineds: true }) : club;
      return this.httpClient.post<{ club: ClubNew }>(`${this.clubsUrl}/${clubId}`, body).pipe(map(response => response.club));
   }
}
