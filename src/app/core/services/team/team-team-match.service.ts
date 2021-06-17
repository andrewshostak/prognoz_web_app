import { Injectable } from '@angular/core';

import { catchError, map } from 'rxjs/operators';
import { environment } from '@env';
import { ErrorHandlerService } from '@services/error-handler.service';
import { HeadersWithToken } from '@services/headers-with-token.service';
import { TeamTeamMatch } from '@models/team/team-team-match.model';
import { Observable } from 'rxjs';

@Injectable()
export class TeamTeamMatchService {
   constructor(private errorHandlerService: ErrorHandlerService, private headersWithToken: HeadersWithToken) {}

   private teamTeamMatchUrl = environment.apiUrl + 'team/team-matches';

   /**
    * Update team-team match
    * @param teamTeamMatch
    * @returns {Observable<TeamTeamMatch>}
    */
   updateTeamTeamMatch(teamTeamMatch: TeamTeamMatch): Observable<TeamTeamMatch> {
      return this.headersWithToken.put(`${this.teamTeamMatchUrl}/${teamTeamMatch.id}`, teamTeamMatch).pipe(
         map(response => response.team_team_match),
         catchError(this.errorHandlerService.handle)
      );
   }
}
