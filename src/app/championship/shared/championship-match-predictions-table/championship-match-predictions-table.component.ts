import { Component, Input } from '@angular/core';

import { ChampionshipService } from '@services/championship/championship.service';
import { ChampionshipMatch } from '@models/championship/championship-match.model';
import { User } from '@models/user.model';
import { UtilsService } from '@services/utils.service';

@Component({
    selector: 'app-championship-match-predictions-table',
    templateUrl: './championship-match-predictions-table.component.html',
    styleUrls: ['./championship-match-predictions-table.component.scss']
})
export class ChampionshipMatchPredictionsTableComponent {
    @Input() match: ChampionshipMatch;
    @Input() authenticatedUser: User;

    getUserPointsOnMatch = ChampionshipService.getUserPointsOnMatch;
    isChampionshipMatchGuessed = ChampionshipService.isChampionshipMatchGuessed;
    isScore = UtilsService.isScore;
    showScoresOrString = UtilsService.showScoresOrString;
}
