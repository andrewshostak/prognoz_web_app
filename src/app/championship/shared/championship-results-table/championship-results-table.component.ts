import { Component, Input } from '@angular/core';

import { ChampionshipMatch } from '../../../shared/models/championship/championship-match.model';

@Component({
    selector: 'app-championship-results-table',
    templateUrl: './championship-results-table.component.html',
    styleUrls: ['./championship-results-table.component.css']
})
export class ChampionshipResultsTableComponent {
    @Input() results: ChampionshipMatch[];
    @Input() error: string;
}
