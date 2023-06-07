import { TeamMatchNew } from '@models/v2/team-match-new.model';
import { TeamPredictionNew } from '@models/v2/team-prediction-new.model';

export class TeamMatchAndEnrichedPredictions {
   teamMatch: TeamMatchNew;
   homePrediction: {
      guessed?: boolean;
      blocked?: boolean;
      prediction?: TeamPredictionNew;
   };
   homePredictionTitle?: string;
   awayPrediction: {
      guessed?: boolean;
      blocked?: boolean;
      prediction?: TeamPredictionNew;
   };
   awayPredictionTitle?: string;
}
