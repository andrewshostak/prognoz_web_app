/* tslint:disable:variable-name */
import { ChampionshipMatchNew } from '@models/new/championship-match-new.model';

export class ChampionshipMatchStatistic {
   public championship_match: ChampionshipMatchNew;
   public results: {
      away: number;
      draw: number;
      home: number;
   };
   public scores: { [key: string]: number }[];
}
