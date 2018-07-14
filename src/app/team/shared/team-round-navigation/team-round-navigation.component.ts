import { Component, Input } from '@angular/core';

import { TeamTeamMatch } from '@models/team/team-team-match.model';

@Component({
    selector: 'app-team-round-navigation',
    templateUrl: './team-round-navigation.component.html',
    styleUrls: ['./team-round-navigation.component.scss']
})
export class TeamRoundNavigationComponent {
    @Input() teamTeamMatches: TeamTeamMatch[];
    @Input() nextRound: boolean;
    @Input() previousRound: boolean;
    @Input() path: string;
}
