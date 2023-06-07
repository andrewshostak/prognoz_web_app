import { Component, Input } from '@angular/core';

import { ChampionshipMatchNew } from '@models/v2/championship-match-new.model';

@Component({
   selector: 'app-championship-results-table',
   styleUrls: ['./championship-results-table.component.scss'],
   templateUrl: './championship-results-table.component.html'
})
export class ChampionshipResultsTableComponent {
   @Input() public results: ChampionshipMatchNew[];
   @Input() public error: string;
}
