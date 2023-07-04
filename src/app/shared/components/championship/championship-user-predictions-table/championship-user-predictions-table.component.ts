import { Component, Input } from '@angular/core';

import { ChampionshipPrediction } from '@models/v2/championship/championship-prediction.model';
import { ChampionshipCompetitionService } from '@services/championship-competition.service';
import { UtilsService } from '@services/utils.service';

@Component({
   selector: 'app-championship-user-predictions-table',
   styleUrls: ['./championship-user-predictions-table.component.scss'],
   templateUrl: './championship-user-predictions-table.component.html'
})
export class ChampionshipUserPredictionsTableComponent {
   @Input() public predictions: ChampionshipPrediction[];

   public getUserPointsOnMatch = ChampionshipCompetitionService.getUserPointsOnMatch;
   public isChampionshipMatchGuessed = ChampionshipCompetitionService.isChampionshipMatchGuessed;
   public isScore = UtilsService.isScore;
   public showScoresOrString = UtilsService.showScoresOrString;
}
