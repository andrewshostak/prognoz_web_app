/* tslint:disable:variable-name */
import { Match } from '@models/match.model';
import { CompetitionNew } from '@models/new/competition-new.model';

export class TeamMatchNew {
   public blocked: number;
   public created_at: string;
   public dc: number;
   public guessed: number;
   public id: number;
   public match_id: number;
   public points: number;
   public predictions: number;
   public updated_at: string;

   public match?: Match;
   public competitions?: CompetitionNew[];
}
