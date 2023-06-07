import { ChampionshipMatch } from '@models/v2/championship/championship-match.model';
import { User } from '@models/v2/user.model';

/* tslint:disable:variable-name */
export class ChampionshipPrediction {
   away: number;
   created_at: string;
   competition_id: number;
   home: number;
   id: number;
   championship_match_id: number;
   updated_at: string;
   user_id?: number;

   user?: User;
   championship_match?: ChampionshipMatch;
}
