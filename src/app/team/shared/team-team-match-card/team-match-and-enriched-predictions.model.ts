import { TeamMatchNew } from '@models/new/team-match-new.model';
import { TeamPredictionNew } from '@models/new/team-prediction-new.model';

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
