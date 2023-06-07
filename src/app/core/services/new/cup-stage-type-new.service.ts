import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@env';
import { PaginatedResponse } from '@models/paginated-response.model';
import { CupStageTypeNew } from '@models/v2/cup-stage-type-new.model';
import { Observable } from 'rxjs';

@Injectable()
export class CupStageTypeNewService {
   public readonly cupStageTypesUrl: string = `${environment.apiBaseUrl}/v2/cup/stage-types`;

   constructor(private httpClient: HttpClient) {}

   public getCupStageTypes(): Observable<PaginatedResponse<CupStageTypeNew>> {
      return this.httpClient.get<PaginatedResponse<CupStageTypeNew>>(this.cupStageTypesUrl);
   }
}
