/* tslint:disable:variable-name */
import { ChampionshipMatch } from '@models/v2/championship/championship-match.model';

export class ChampionshipMatchStatistic {
   championship_match: ChampionshipMatch;
   results: {
      away: number;
      draw: number;
      home: number;
   };
   scores: { [key: string]: number }[];
}
