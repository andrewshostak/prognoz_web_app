import { Component, Input } from '@angular/core';

import { environment } from '@env';
import { TeamRating } from '@models/team/team-rating.model';
import { User } from '@models/user.model';
import { UtilsService } from '@services/utils.service';

@Component({
    selector: 'app-team-rating-table',
    templateUrl: './team-rating-table.component.html',
    styleUrls: ['./team-rating-table.component.scss']
})
export class TeamRatingTableComponent {
    @Input() teamRating: TeamRating[];
    @Input() errorTeamRating: string;
    @Input() authenticatedUser: User;

    teamImageDefault: string = environment.imageTeamDefault;
    teamImagesUrl: string = environment.apiImageTeams;
    makeUnsigned = UtilsService.makeUnsigned;
}