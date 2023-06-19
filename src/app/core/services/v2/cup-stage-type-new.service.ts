import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@env';
import { PaginatedResponse } from '@models/paginated-response.model';
import { CupStageType } from '@models/v2/cup/cup-stage-type.model';
import { Observable } from 'rxjs';

@Injectable()
export class CupStageTypeNewService {
   public readonly cupStageTypesUrl: string = `${environment.apiBaseUrl}/v2/cup/stage-types`;

   constructor(private httpClient: HttpClient) {}

   public getCupStageTypes(): Observable<PaginatedResponse<CupStageType>> {
      return this.httpClient.get<PaginatedResponse<CupStageType>>(this.cupStageTypesUrl);
   }
}
