import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@env';
import { PaginatedResponse } from '@models/paginated-response.model';
import { TeamStageType } from '@models/v2/team/team-stage-type.model';
import { Observable } from 'rxjs';

@Injectable()
export class TeamStageTypeService {
   public readonly teamStageTypesUrl: string = `${environment.apiBaseUrl}/v2/team/stage-types`;

   constructor(private httpClient: HttpClient) {}

   // TODO: improvement: save first call result and return it
   public getTeamStageTypes(): Observable<PaginatedResponse<TeamStageType>> {
      return this.httpClient.get<PaginatedResponse<TeamStageType>>(this.teamStageTypesUrl);
   }
}
