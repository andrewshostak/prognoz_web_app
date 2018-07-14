import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

import { CupRating } from '@models/cup/cup-rating.model';

@Component({
    selector: 'app-cup-rating-season-details',
    templateUrl: './cup-rating-season-details.component.html',
    styleUrls: ['./cup-rating-season-details.component.scss']
})
export class CupRatingSeasonDetailsComponent implements OnInit, OnChanges {
    constructor() {}

    @Input() cupRating: CupRating;

    winDrawLossChartColors: any[];
    winDrawLossChartLabels: string[];
    winDrawLossChartOptions: any;
    winDrawLossChartType: string;
    winDrawLossChartData: number[];

    scoredMissedChartColors: any[];
    scoredMissedChartData: number[];
    scoredMissedChartLabels: string[];
    scoredMissedChartType: string;

    ngOnChanges(simpleChanges: SimpleChanges) {
        for (const propName in simpleChanges) {
            if (propName === 'cupRating' && simpleChanges[propName].currentValue) {
                const cupRating = simpleChanges[propName].currentValue;
                this.winDrawLossChartLabels = ['Виграші', 'Нічиї', 'Програші'];
                this.winDrawLossChartColors = [{ backgroundColor: ['#28a745', '#ffc107', '#dc3545'] }];
                this.winDrawLossChartData = [cupRating.win, cupRating.draw, cupRating.loss];
                this.scoredMissedChartData = [cupRating.scored, cupRating.missed];
                this.scoredMissedChartLabels = ['Забиті', 'Пропущені'];
                this.scoredMissedChartColors = [{ backgroundColor: ['#007bff', '#e83e8c'] }];
            }
        }
    }

    ngOnInit() {
        this.winDrawLossChartType = 'bar';
        this.scoredMissedChartType = 'doughnut';
        this.winDrawLossChartOptions = {
            responsive: true,
            legend: {
                display: false
            },
            scales: {
                yAxes: [
                    {
                        ticks: {
                            beginAtZero: true,
                            stepSize: 1
                        }
                    }
                ]
            },
            tooltips: {
                callbacks: {
                    label: tooltipItem => tooltipItem.yLabel
                }
            }
        };
    }
}
