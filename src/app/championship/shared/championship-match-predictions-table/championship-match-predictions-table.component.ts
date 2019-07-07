import { Component, Input } from '@angular/core';

import { ChampionshipMatchNew } from '@models/new/championship-match-new.model';
import { ChampionshipPredictionNew } from '@models/new/championship-prediction-new.model';
import { User } from '@models/user.model';
import { ChampionshipService } from '@services/championship/championship.service';
import { UtilsService } from '@services/utils.service';

@Component({
   selector: 'app-championship-match-predictions-table',
   styleUrls: ['./championship-match-predictions-table.component.scss'],
   templateUrl: './championship-match-predictions-table.component.html'
})
export class ChampionshipMatchPredictionsTableComponent {
   @Input() public championshipMatch: ChampionshipMatchNew;
   @Input() public authenticatedUser: User;
   @Input() public championshipPredictions: ChampionshipPredictionNew[];

   public getUserPointsOnMatch = ChampionshipService.getUserPointsOnMatch;
   public isChampionshipMatchGuessed = ChampionshipService.isChampionshipMatchGuessed;
   public isScore = UtilsService.isScore;
   public showScoresOrString = UtilsService.showScoresOrString;
}
