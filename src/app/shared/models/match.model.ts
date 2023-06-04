/* tslint:disable:variable-name */
import { ClubNew } from '@models/new/club-new.model';
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

   club_home?: ClubNew;
   club_away?: ClubNew;
}
