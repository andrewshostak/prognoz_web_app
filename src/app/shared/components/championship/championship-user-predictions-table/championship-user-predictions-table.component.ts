import { Component, Input } from '@angular/core';

import { ChampionshipPrediction } from '@models/championship/championship-prediction.model';
import { ChampionshipService } from '@services/championship/championship.service';
import { UtilsService } from '@services/utils.service';

@Component({
    selector: 'app-championship-user-predictions-table',
    templateUrl: './championship-user-predictions-table.component.html',
    styleUrls: ['./championship-user-predictions-table.component.scss']
})
export class ChampionshipUserPredictionsTableComponent {
    @Input() predictions: ChampionshipPrediction[];
    @Input() error: string;

    getUserPointsOnMatch = ChampionshipService.getUserPointsOnMatch;
    isChampionshipMatchGuessed = ChampionshipService.isChampionshipMatchGuessed;
    isScore = UtilsService.isScore;
    showScoresOrString = UtilsService.showScoresOrString;
}
