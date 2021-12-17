/* tslint:disable:variable-name */
import { CompetitionState } from '@enums/competition-state.enum';

export class Competition {
   id: number;
   tournament_id: number;
   season_id: number;
   title: string;
   stated: boolean;
   active: boolean;
   ended: boolean;
   state: CompetitionState;
   participants: number;
   players_in_group: number;
   first_playoff_stage: number;
   number_in_season: number;
   active_round: number;
   winners: any[];
   number_of_teams: number;
   cup_applications: any[];
}
