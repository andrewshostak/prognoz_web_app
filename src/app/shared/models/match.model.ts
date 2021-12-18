/* tslint:disable:variable-name */
import { Club } from '@models/club.model';
import { MatchState } from '@enums/match-state.enum';

export class Match {
   public away: number;
   public away_club_id: number;
   public created_at: string;
   public id: number;
   public home: number;
   public home_club_id: number;
   public started_at: string;
   public state: MatchState;
   public updated_at: string;

   public club_home?: Club;
   public club_away?: Club;
}
