/* tslint:disable:variable-name */
import { CupStageState } from '@enums/cup-stage-state.enum';

export class CupStage {
   id: number;
   competition_id: number;
   cup_stage_type_id: number;
   round: number;
   title: string;
   active: boolean;
   ended: boolean;
   state: CupStageState;
   competition: {
      title: string;
   };
   cup_stage_type: {
      title: string;
   };
   cup_matches: {
      id: number;
   }[];
   cup_cup_matches: {
      id: number;
      home_user: {
         name: string;
         image: string;
         hometown: string;
      };
      away_user: {
         name: string;
         image: string;
         hometown: string;
      };
      home: number;
      away: number;
      score: string;
      group_number: number;
   }[];
}
