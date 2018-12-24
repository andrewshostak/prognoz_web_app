import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { CupRating } from '@models/cup/cup-rating.model';
import { User } from '@models/user.model';
import { Season } from '@models/season.model';

@Component({
    selector: 'app-cup-rating-table',
    templateUrl: './cup-rating-table.component.html',
    styleUrls: ['./cup-rating-table.component.scss']
})
export class CupRatingTableComponent implements OnChanges {
    @Input() cupRating: CupRating[];
    @Input() errorCupRating: string;
    @Input() authenticatedUser: User;
    @Input() seasons: Season[];

    activeSeason: Season;
    beforePreviousSeason: Season;
    previousSeason: Season;

    ngOnChanges(changes: SimpleChanges) {
        for (const propName of Object.keys(changes)) {
            if (!changes[propName].firstChange && propName === 'seasons') {
                const seasonIds: number[] = [];
                changes[propName].currentValue.forEach(season => {
                    if (season.active) {
                        this.activeSeason = season;
                        seasonIds.push(season.id);
                    } else if (this.activeSeason && !this.previousSeason) {
                        this.previousSeason = season;
                        seasonIds.push(season.id);
                    } else if (this.previousSeason && !this.beforePreviousSeason) {
                        this.beforePreviousSeason = season;
                        seasonIds.push(season.id);
                    }
                });
            }
        }
    }
}
