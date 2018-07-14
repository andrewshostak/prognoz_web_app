import { Component, Input } from '@angular/core';

import { ChampionshipMatch } from '../../../models/championship/championship-match.model';

@Component({
    selector: 'app-championship-results-table',
    templateUrl: './championship-results-table.component.html',
    styleUrls: ['./championship-results-table.component.scss']
})
export class ChampionshipResultsTableComponent {
    @Input() results: ChampionshipMatch[];
    @Input() error: string;
}
