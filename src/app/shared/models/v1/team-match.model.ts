// tslint:disable:variable-name
import { Match } from '@models/v2/match.model';
import { TeamPrediction } from '@models/v1/team-prediction.model';

export class TeamMatch {
   id: number;
   competition_id: number;
   predictions: number;
   points: number;
   dc: number;
   guessed: number;
   blocked: number;
   is_predictable: boolean;

   team_predictions?: TeamPrediction[];
   match?: Match;
}
