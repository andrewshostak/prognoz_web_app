import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@env';
import { Tournament } from '@models/v2/tournament.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TournamentNewService {
   private tournamentsUrl = environment.apiBaseUrl + '/v2/tournaments';

   constructor(private httpClient: HttpClient) {}

   public getTournaments(): Observable<Tournament[]> {
      return this.httpClient.get<{ tournaments: Tournament[] }>(this.tournamentsUrl).pipe(map(response => response.tournaments));
   }
}
