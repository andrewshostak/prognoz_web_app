/* tslint:disable:variable-name */
import { TeamNew } from '@models/v2/team-new.model';

export class TeamRatingNew {
   id: number;
   competition_id: number;
   team_id: number;
   points: number;
   scored: number;
   missed: number;
   blocked: number;
   win: number;
   draw: number;
   loss: number;
   points_championship: number;
   dc: number;
   position: number;
   moving: number;
   group_number: number;

   team?: TeamNew;
}
