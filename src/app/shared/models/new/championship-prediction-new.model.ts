import { User } from '@models/user.model';

/* tslint:disable:variable-name */
export class ChampionshipPredictionNew {
   public away: number;
   public created_at: string;
   public competition_id: number;
   public home: number;
   public id: number;
   public match_id: number;
   public updated_at: string;
   public user_id?: number;

   public user?: User;
}
