import { Component, Input } from '@angular/core';

import { MatchState } from '@enums/match-state.enum';
import { TeamMatch } from '@models/v2/team/team-match.model';

@Component({
   selector: 'app-team-results-table',
   templateUrl: './team-results-table.component.html',
   styleUrls: ['./team-results-table.component.scss']
})
export class TeamResultsTableComponent {
   @Input() teamMatches: TeamMatch[];

   public matchStates = MatchState;
}
