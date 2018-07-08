import { Component, Input } from '@angular/core';

import { environment } from '@env';
import { TeamRating } from '../../../shared/models/team/team-rating.model';
import { User } from '../../../shared/models/user.model';
import { HelperService } from '../../../core/services/helper.service';

@Component({
    selector: 'app-team-rating-table',
    templateUrl: './team-rating-table.component.html',
    styleUrls: ['./team-rating-table.component.css']
})
export class TeamRatingTableComponent {
    @Input() teamRating: TeamRating[];
    @Input() errorTeamRating: string;
    @Input() authenticatedUser: User;

    teamImageDefault: string = environment.imageTeamDefault;
    teamImagesUrl: string = environment.apiImageTeams;

    constructor(public helperService: HelperService) {}
}
