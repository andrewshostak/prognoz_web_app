import { Component, Input } from '@angular/core';

import { TeamMatch } from '@models/team/team-match.model';

@Component({
    selector: 'app-team-results-table',
    templateUrl: './team-results-table.component.html',
    styleUrls: ['./team-results-table.component.scss']
})
export class TeamResultsTableComponent {
    @Input() teamMatches: TeamMatch[];
    @Input() error: string;
}
