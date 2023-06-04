import { ChampionshipMatchNew } from '@models/new/championship-match-new.model';
import { User } from '@models/user.model';

/* tslint:disable:variable-name */
export class ChampionshipPredictionNew {
   away: number;
   created_at: string;
   competition_id: number;
   home: number;
   id: number;
   championship_match_id: number;
   updated_at: string;
   user_id?: number;

   user?: User;
   championship_match?: ChampionshipMatchNew;
}
