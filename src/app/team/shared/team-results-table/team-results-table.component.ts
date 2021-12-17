import { Component, Input } from '@angular/core';

import { MatchState } from '@enums/match-state.enum';
import { TeamMatchNew } from '@models/new/team-match-new.model';

@Component({
   selector: 'app-team-results-table',
   templateUrl: './team-results-table.component.html',
   styleUrls: ['./team-results-table.component.scss']
})
export class TeamResultsTableComponent {
   @Input() teamMatches: TeamMatchNew[];

   public matchStates = MatchState;
}
