import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@env';
import { TournamentNew } from '@models/new/tournament-new.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TournamentNewService {
   private tournamentsUrl = environment.apiBaseUrl + '/v2/tournaments';

   constructor(private httpClient: HttpClient) {}

   public getTournaments(): Observable<TournamentNew[]> {
      return this.httpClient.get<{ tournaments: TournamentNew[] }>(this.tournamentsUrl).pipe(map(response => response.tournaments));
   }
}
