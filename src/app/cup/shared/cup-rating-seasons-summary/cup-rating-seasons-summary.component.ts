import { Component, Input, OnDestroy, OnInit, ElementRef, OnChanges, SimpleChanges }    from '@angular/core';

import { CupRating }                                                                    from '../../../shared/models/cup-rating.model';
import { environment }                                                                  from '../../../../environments/environment';

declare const $: any;

@Component({
  selector: 'app-cup-rating-seasons-summary',
  templateUrl: './cup-rating-seasons-summary.component.html',
  styleUrls: ['./cup-rating-seasons-summary.component.css']
})
export class CupRatingSeasonsSummaryComponent implements OnInit, OnDestroy, OnChanges {

    constructor(
        private elementRef: ElementRef
    ) { }

    @Input() cupRating: CupRating;

    clubImagesUrl: string;
    userImageDefault: string;
    userImagesUrl: string;
    winDrawLossChartColors: any[];
    winDrawLossChartData: any[];
    winDrawLossChartLabels: string[];
    winDrawLossChartLegend: boolean;
    winDrawLossChartOptions: any;
    winDrawLossChartType: string;

    ngOnDestroy() {
        $(this.elementRef.nativeElement.querySelectorAll('[data-toggle="tooltip"]')).tooltip('dispose');
    }

    ngOnChanges(simpleChanges: SimpleChanges) {
        for (const propName in simpleChanges) {
            if (propName === 'cupRating' && simpleChanges[propName].currentValue) {
                $(() => $(this.elementRef.nativeElement.querySelectorAll('[data-toggle="tooltip"]')).tooltip());
                const cupRating = simpleChanges[propName].currentValue;
                this.winDrawLossChartLabels = [];
                this.winDrawLossChartData = [
                    {data: [], label: 'Виграші'},
                    {data: [], label: 'Нічиї'},
                    {data: [], label: 'Програші'},
                ];
                if (cupRating.before_previous_season) {
                    this.winDrawLossChartLabels.push(cupRating.before_previous_season.season.title);
                    this.winDrawLossChartData[0].data.push(cupRating.before_previous_season.win);
                    this.winDrawLossChartData[1].data.push(cupRating.before_previous_season.draw);
                    this.winDrawLossChartData[2].data.push(cupRating.before_previous_season.loss);
                }
                if (cupRating.previous_season) {
                    this.winDrawLossChartLabels.push(cupRating.previous_season.season.title);
                    this.winDrawLossChartData[0].data.push(cupRating.previous_season.win);
                    this.winDrawLossChartData[1].data.push(cupRating.previous_season.draw);
                    this.winDrawLossChartData[2].data.push(cupRating.previous_season.loss);
                }
                if (cupRating.active_season) {
                    this.winDrawLossChartLabels.push(cupRating.active_season.season.title);
                    this.winDrawLossChartData[0].data.push(cupRating.active_season.win);
                    this.winDrawLossChartData[1].data.push(cupRating.active_season.draw);
                    this.winDrawLossChartData[2].data.push(cupRating.active_season.loss);
                }
            }
        }
    }

    ngOnInit() {
        this.clubImagesUrl = environment.apiImageClubs;
        this.userImageDefault = environment.imageUserDefault;
        this.userImagesUrl = environment.apiImageUsers;
        this.winDrawLossChartType = 'bar';
        this.winDrawLossChartColors = [
            {backgroundColor: '#28a745'},
            {backgroundColor: '#ffc107'},
            {backgroundColor: '#dc3545'}
        ];
        this.winDrawLossChartLegend = true;
        this.winDrawLossChartOptions = {
            responsive: true,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        stepSize: 1
                    }
                }]
            }
        };
    }

}
