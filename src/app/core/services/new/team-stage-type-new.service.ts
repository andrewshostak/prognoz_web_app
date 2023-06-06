import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@env';
import { PaginatedResponse } from '@models/paginated-response.model';
import { TeamStageTypeNew } from '@models/new/team-stage-type-new.model';
import { Observable } from 'rxjs';

@Injectable()
export class TeamStageTypeNewService {
   public readonly teamStageTypesUrl: string = `${environment.apiBaseUrl}/v2/team/stage-types`;

   constructor(private httpClient: HttpClient) {}

   // todo: improvement: save first call result and return it
   public getTeamStageTypes(): Observable<PaginatedResponse<TeamStageTypeNew>> {
      return this.httpClient.get<PaginatedResponse<TeamStageTypeNew>>(this.teamStageTypesUrl);
   }
}
