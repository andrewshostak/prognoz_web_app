import { Component, Input } from '@angular/core';

import { ChampionshipMatch } from '@models/championship/championship-match.model';
import { HelperService } from '@services/helper.service';
import { User } from '@models/user.model';

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
