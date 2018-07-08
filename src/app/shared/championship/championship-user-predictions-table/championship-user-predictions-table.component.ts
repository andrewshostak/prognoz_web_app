import { Component, Input } from '@angular/core';

import { ChampionshipPrediction } from '@models/championship/championship-prediction.model';
import { HelperService } from '@services/helper.service';

@Component({
    selector: 'app-championship-user-predictions-table',
    templateUrl: './championship-user-predictions-table.component.html',
    styleUrls: ['./championship-user-predictions-table.component.css']
})
export class ChampionshipUserPredictionsTableComponent {
    @Input() predictions: ChampionshipPrediction[];
    @Input() error: string;

    constructor(public helperService: HelperService) {}
}
