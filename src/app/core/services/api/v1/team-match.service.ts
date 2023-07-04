import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@env';
import { RequestParams } from '@models/request-params.model';
import { Observable } from 'rxjs';
import { TeamMatch } from '@models/v1/team-match.model';

@Injectable()
export class TeamMatchService {
   private teamMatchUrl = environment.apiBaseUrl + '/team/matches';

   constructor(private httpClient: HttpClient) {}

   /**
    * @deprecated
    * TODO: create and use v2 endpoint instead of this
    *
    * possible "filter" values: "my", "opponents"
    *
    * - "my"
    * where: /team/my on init and stage change
    * params: team_stage_id
    * relations: predictions, predictions.user, match, club-first, club-second
    * why: to show matches & predictions (team strategy)
    * note: protected, loaded by current user
    *
    * - "opponents"
    * where /team/predictions on init and stage change
    * params: team_stage_id
    * relations: predictions (only some values), match, club-first, club-second
    * why:
    *    - to show matches in a goalkeeper dropdown and show which are blocked (from prediction relation)
    *    - to understand if the stage was started
    *    - to get team_match_id, team_id, prediction id (if it is present) for updating blocked_by
    * note: protected, loaded by current user
    */
   public getTeamMatchesAuthUser(requestParams: RequestParams[]): Observable<{ team_matches: TeamMatch[] }> {
      let params: HttpParams = new HttpParams();
      const url = `${this.teamMatchUrl}-predictable`;
      for (const requestParam of requestParams) {
         params = params.append(requestParam.parameter, requestParam.value);
      }
      return this.httpClient.get<{ team_matches: TeamMatch[] }>(url, { params });
   }
}
