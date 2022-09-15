import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@env';
import { RequestParams } from '@models/request-params.model';
import { TeamMatch } from '@models/team/team-match.model';
import { ErrorHandlerService } from '@services/error-handler.service';
import { HeadersWithToken } from '@services/headers-with-token.service';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class TeamMatchService {
   private teamMatchUrl = environment.apiUrl + 'team/matches';

   constructor(
      private errorHandlerService: ErrorHandlerService,
      private headersWithToken: HeadersWithToken,
      private httpClient: HttpClient
   ) {}

   /**
    * @deprecated
    * filter values: team-team-match
    * where: team/team-matches when card opens
    * params: team_stage_id, home_team_id, away_team_id
    * relations: predictions, predictions.user, match, club-first, club-second
    * note: public, some predictions should be hidden
    * why do we need: to show matches & predictions
    */
   public getTeamMatches(requestParams?: RequestParams[]): Observable<{ team_matches: TeamMatch[] }> {
      let params: HttpParams = new HttpParams();
      if (requestParams) {
         for (const requestParam of requestParams) {
            params = params.append(requestParam.parameter, requestParam.value);
         }
      }
      return this.httpClient
         .get<{ team_matches: TeamMatch[] }>(this.teamMatchUrl, { params })
         .pipe(catchError(this.errorHandlerService.handle));
   }

   /**
    * @deprecated
    * filter values: my, opponents
    *
    * my
    * where: /team/my on init and stage change
    * params: team_stage_id,
    * relations: predictions, predictions.user, match, club-first, club-second
    * note: protected, loaded by current user
    * why do we need: to show matches & predictions (team strategy)
    *
    * opponents
    * where /team/predictions on init and stage change
    * params: team_stage_id
    * relations: predictions (only some values), match, club-first, club-second
    * note: protected, loaded by current user
    * why do we need:
    *    - to show matches in a goalkeeper dropdown and show which are blocked (from prediction relation)
    *    - to understand if the stage was started
    *    - to get team_match_id, team_id, prediction id (if it is present) for updating blocked_by
    */
   public getTeamMatchesAuthUser(requestParams: RequestParams[]): Observable<any> {
      let params: HttpParams = new HttpParams();
      const url = `${this.teamMatchUrl}-predictable`;
      for (const requestParam of requestParams) {
         params = params.append(requestParam.parameter, requestParam.value);
      }
      return this.headersWithToken.get(url, params).pipe(catchError(this.errorHandlerService.handle));
   }
}
