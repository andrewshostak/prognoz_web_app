/* tslint:disable:variable-name */
import { CupApplicationPlace } from '@enums/cup-application-place.enum';
import { ModelStatus } from '@enums/model-status.enum';
import { CompetitionNew } from '@models/v2/competition-new.model';
import { UserNew } from '@models/v2/user-new.model';

// TODO: remove receiver_id, place, refused_at, ended, receiver. add state.
export class CupApplicationNew {
   id: number;
   competition_id: number;
   applicant_id: number;
   receiver_id: number;
   place: CupApplicationPlace;
   confirmed_at: string;
   refused_at: string;
   ended: ModelStatus;
   points: number;
   created_at: string;
   updated_at: string;

   competition?: CompetitionNew;
   applicant?: UserNew;
   receiver?: UserNew;
}
