import { Component, Input } from '@angular/core';

import { ChampionshipPredictionNew } from '@models/new/championship-prediction-new.model';
import { ChampionshipService } from '@services/championship/championship.service';
import { UtilsService } from '@services/utils.service';

@Component({
   selector: 'app-championship-user-predictions-table',
   styleUrls: ['./championship-user-predictions-table.component.scss'],
   templateUrl: './championship-user-predictions-table.component.html'
})
export class ChampionshipUserPredictionsTableComponent {
   @Input() public predictions: ChampionshipPredictionNew[];

   public getUserPointsOnMatch = ChampionshipService.getUserPointsOnMatch;
   public isChampionshipMatchGuessed = ChampionshipService.isChampionshipMatchGuessed;
   public isScore = UtilsService.isScore;
   public showScoresOrString = UtilsService.showScoresOrString;
}
