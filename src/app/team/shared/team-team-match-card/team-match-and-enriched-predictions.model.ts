import { TeamMatch } from '@models/v2/team/team-match.model';
import { TeamPrediction } from '@models/v2/team/team-prediction.model';

export class TeamMatchAndEnrichedPredictions {
   teamMatch: TeamMatch;
   homePrediction: {
      guessed?: boolean;
      blocked?: boolean;
      prediction?: TeamPrediction;
   };
   homePredictionTitle?: string;
   awayPrediction: {
      guessed?: boolean;
      blocked?: boolean;
      prediction?: TeamPrediction;
   };
   awayPredictionTitle?: string;
}
