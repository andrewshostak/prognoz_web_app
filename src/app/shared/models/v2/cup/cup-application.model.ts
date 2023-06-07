/* tslint:disable:variable-name */
import { CupApplicationPlace } from '@enums/cup-application-place.enum';
import { ModelStatus } from '@enums/model-status.enum';
import { Competition } from '@models/v2/competition.model';
import { User } from '@models/v2/user.model';

// TODO: remove receiver_id, place, refused_at, ended, receiver. add state.
export class CupApplication {
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

   competition?: Competition;
   applicant?: User;
   receiver?: User;
}
