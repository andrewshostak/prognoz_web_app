/* tslint:disable:variable-name */
import { Club } from '@models/v2/club.model';
import { MatchState } from '@enums/match-state.enum';

export class Match {
   away: number;
   away_club_id: number;
   created_at: string;
   id: number;
   home: number;
   home_club_id: number;
   started_at: string;
   state: MatchState;
   updated_at: string;

   club_home?: Club;
   club_away?: Club;
}
