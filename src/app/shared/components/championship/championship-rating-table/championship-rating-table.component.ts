import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';

import { ChampionshipRating } from '@models/championship/championship-rating.model';
import { environment } from '@env';
import { HelperService } from '@services/helper.service';

declare const $: any;

@Component({
    selector: 'app-championship-rating-table',
    templateUrl: './championship-rating-table.component.html',
    styleUrls: ['./championship-rating-table.component.scss']
})
export class ChampionshipRatingTableComponent implements OnChanges, OnDestroy {
    @Input() rating: ChampionshipRating[];
    @Input() error: string;
    @Input() authenticatedUser: any;

    clubsImagesUrl: string = environment.apiImageClubs;

    constructor(public helperService: HelperService) {}

    ngOnChanges(changes: SimpleChanges) {
        for (const propName in changes) {
            if (!changes[propName].firstChange && propName === 'rating') {
                $(() => $('[data-toggle="tooltip"]').tooltip());
            }
        }
    }

    ngOnDestroy() {
        $('[data-toggle="tooltip"]').tooltip('dispose');
    }
}
