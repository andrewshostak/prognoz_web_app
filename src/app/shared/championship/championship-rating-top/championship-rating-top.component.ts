import { Component, OnInit } from '@angular/core';

import { ChampionshipRating } from '../../models/championship-rating.model';
import { ChampionshipRatingService } from '../../../championship/shared/championship-rating.service';
import { environment } from '../../../../environments/environment';
import { HelperService } from '../../../core/helper.service';

@Component({
    selector: 'app-championship-rating-top',
    templateUrl: './championship-rating-top.component.html',
    styleUrls: ['./championship-rating-top.component.css']
})
export class ChampionshipRatingTopComponent implements OnInit {
    constructor(private championshipRatingService: ChampionshipRatingService, public helperService: HelperService) {}

    championshipRatingItems: ChampionshipRating[];
    errorRating: string;
    userImageDefault: string = environment.imageUserDefault;
    userImagesUrl: string = environment.apiImageUsers;

    ngOnInit() {
        this.topRating();
    }

    topRating() {
        const param = [{ parameter: 'limit', value: '5' }];
        this.championshipRatingService.getChampionshipRatingItems(param).subscribe(
            response => {
                if (response) {
                    this.championshipRatingItems = response.championship_ratings;
                }
            },
            error => {
                this.errorRating = error;
            }
        );
    }
}
