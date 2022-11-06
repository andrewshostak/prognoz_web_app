/* tslint:disable:variable-name */
import { TeamNew } from '@models/new/team-new.model';

export class TeamRatingNew {
   public id: number;
   public competition_id: number;
   public team_id: number;
   public points: number;
   public scored: number;
   public missed: number;
   public blocked: number;
   public win: number;
   public draw: number;
   public loss: number;
   public points_championship: number;
   public dc: number;
   public position: number;
   public moving: number;
   public group_number: number;

   public team?: TeamNew;
}
