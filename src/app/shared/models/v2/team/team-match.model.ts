/* tslint:disable:variable-name */
import { Match } from '@models/v2/match.model';
import { TeamStage } from '@models/v2/team/team-stage.model';

export class TeamMatch {
   blocked: number;
   created_at: string;
   dc: number;
   guessed: number;
   id: number;
   match_id: number;
   points: number;
   predictions: number;
   updated_at: string;

   are_predictions_viewable?: boolean;
   match?: Match;
   team_stages?: TeamStage[];
}
