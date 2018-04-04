import { Component, ElementRef, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';

import { CupRating }                                                         from '../../../shared/models/cup-rating.model';
import { environment }                                                       from '../../../../environments/environment';
import { HelperService }                                                     from '../../../core/helper.service';
import { User }                                                              from '../../../shared/models/user.model';
import { Season }                                                            from '../../../shared/models/season.model';

declare const $: any;

@Component({
  selector: 'app-cup-rating-table',
  templateUrl: './cup-rating-table.component.html',
  styleUrls: ['./cup-rating-table.component.css']
})
export class CupRatingTableComponent implements OnChanges, OnDestroy {

    constructor(
        private elementRef: ElementRef,
        public helperService: HelperService
    ) { }

    @Input() cupRating: CupRating[];
    @Input() errorCupRating: string;
    @Input() authenticatedUser: User;
    @Input() seasons: Season[];

    activeSeason: Season;
    beforePreviousSeason: Season;
    clubsImagesUrl: string = environment.apiImageClubs;
    previousSeason: Season;

    ngOnChanges(changes: SimpleChanges) {
        for (const propName in changes) {
            if (!changes[propName].firstChange && propName === 'cupRating') {
                $(() => $(this.elementRef.nativeElement.querySelectorAll('[data-toggle="tooltip"]')).tooltip());
            }
            if (!changes[propName].firstChange && propName === 'seasons') {
                const seasonIds: number[] = [];
                changes[propName].currentValue.forEach((season) => {
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

    ngOnDestroy() {
        $(this.elementRef.nativeElement.querySelectorAll('[data-toggle="tooltip"]')).tooltip('dispose');
    }

}
