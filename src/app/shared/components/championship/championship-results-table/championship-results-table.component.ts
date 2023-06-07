import { Component, Input } from '@angular/core';

import { ChampionshipMatch } from '@models/v2/championship/championship-match.model';

@Component({
   selector: 'app-championship-results-table',
   styleUrls: ['./championship-results-table.component.scss'],
   templateUrl: './championship-results-table.component.html'
})
export class ChampionshipResultsTableComponent {
   @Input() public results: ChampionshipMatch[];
   @Input() public error: string;
}
