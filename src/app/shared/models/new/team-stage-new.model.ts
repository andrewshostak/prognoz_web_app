/* tslint:disable:variable-name */
import { TeamStageState } from '@enums/team-stage-state.enum';

export class TeamStageNew {
   public id: number;
   public team_stage_type_id: number;
   public competition_id: number;
   public title: string;
   public round: string;
   public state: TeamStageState;
   public created_at: string;
   public updated_at: string;
}
