// tslint:disable:variable-name
import { Match } from '@models/v2/match.model';

export class TeamMatch {
   id: number;
   competition_id: number;
   t1_id: number;
   t2_id: number;
   home: number;
   away: number;
   starts_at: string;
   predictions: number;
   points: number;
   dc: number;
   guessed: number;
   blocked: number;
   active: boolean;
   ended: boolean;
   is_predictable: boolean;
   club_first: any;
   club_second: any;

   team_predictions: any;
   match: Match;
}