/* tslint:disable:variable-name */
import { ChampionshipMatch } from '@models/championship/championship-match.model';

export class ChampionshipMatchStatistic {
   public championship_match: ChampionshipMatch;
   public results: {
      away: number;
      draw: number;
      home: number;
   };
   public scores: Array<{ [key: string]: number }>;
}
