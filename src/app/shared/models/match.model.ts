/* tslint:disable:variable-name */
import { Club } from '@models/club.model';

export class Match {
   public active: boolean;
   public away: number;
   public away_club_id: number;
   public created_at: string;
   public ended: boolean;
   public id: number;
   public home: number;
   public home_club_id: number;
   public started_at: string;
   public updated_at: string;

   public club_home?: Club;
   public club_away?: Club;
}
