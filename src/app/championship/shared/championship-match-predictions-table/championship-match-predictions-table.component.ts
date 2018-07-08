import { Component, Input } from '@angular/core';

import { ChampionshipMatch } from '../../../shared/models/championship/championship-match.model';
import { HelperService } from '../../../core/services/helper.service';
import { User } from '../../../shared/models/user.model';

@Component({
    selector: 'app-championship-match-predictions-table',
    templateUrl: './championship-match-predictions-table.component.html',
    styleUrls: ['./championship-match-predictions-table.component.css']
})
export class ChampionshipMatchPredictionsTableComponent {
    @Input() match: ChampionshipMatch;
    @Input() authenticatedUser: User;

    constructor(public helperService: HelperService) {}
}
