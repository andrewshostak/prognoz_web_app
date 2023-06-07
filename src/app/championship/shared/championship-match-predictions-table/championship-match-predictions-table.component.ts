import { Component, Input } from '@angular/core';

import { ChampionshipMatch } from '@models/v2/championship/championship-match.model';
import { ChampionshipPrediction } from '@models/v2/championship/championship-prediction.model';
import { User } from '@models/v1/user.model';
import { ChampionshipService } from '@services/championship/championship.service';
import { UtilsService } from '@services/utils.service';

@Component({
   selector: 'app-championship-match-predictions-table',
   styleUrls: ['./championship-match-predictions-table.component.scss'],
   templateUrl: './championship-match-predictions-table.component.html'
})
export class ChampionshipMatchPredictionsTableComponent {
   @Input() public championshipMatch: ChampionshipMatch;
   @Input() public authenticatedUser: User;
   @Input() public championshipPredictions: ChampionshipPrediction[];

   public getUserPointsOnMatch = ChampionshipService.getUserPointsOnMatch;
   public isChampionshipMatchGuessed = ChampionshipService.isChampionshipMatchGuessed;
   public isScore = UtilsService.isScore;
   public showScoresOrString = UtilsService.showScoresOrString;
}
