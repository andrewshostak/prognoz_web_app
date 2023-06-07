/* tslint:disable:variable-name */
import { ChampionshipMatchNew } from '@models/v2/championship-match-new.model';

export class ChampionshipMatchStatistic {
   championship_match: ChampionshipMatchNew;
   results: {
      away: number;
      draw: number;
      home: number;
   };
   scores: { [key: string]: number }[];
}
