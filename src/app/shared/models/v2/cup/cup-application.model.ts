/* tslint:disable:variable-name */
import { ModelStatus } from '@enums/model-status.enum';
import { Competition } from '@models/v2/competition.model';
import { User } from '@models/v2/user.model';

// TODO: use state (when it will be returned from backend) and remove refused_at, ended
export class CupApplication {
   id: number;
   competition_id: number;
   applicant_id: number;
   confirmed_at: string;
   refused_at: string;
   ended: ModelStatus;
   points: number;
   created_at: string;
   updated_at: string;

   competition?: Competition;
   applicant?: User;
}
