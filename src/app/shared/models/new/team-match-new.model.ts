/* tslint:disable:variable-name */
import { Match } from '@models/match.model';
import { TeamStageNew } from '@models/new/team-stage-new.model';

export class TeamMatchNew {
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
   team_stages?: TeamStageNew[];
}
