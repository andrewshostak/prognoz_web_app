import { Component, Input } from '@angular/core';

import { TeamMatch }        from '../../models/team-match.model';

@Component({
  selector: 'app-team-results-table',
  templateUrl: './team-results-table.component.html',
  styleUrls: ['./team-results-table.component.css']
})
export class TeamResultsTableComponent {

    @Input() teamMatches: TeamMatch[];
    @Input() error: string;
}
