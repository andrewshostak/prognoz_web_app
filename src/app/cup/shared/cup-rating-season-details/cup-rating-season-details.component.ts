import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

import { CupRatingNew } from '@models/v2/cup-rating-new.model';
import { Label, SingleOrMultiDataSet } from 'ng2-charts/lib/base-chart.directive';
import { ChartOptions } from 'chart.js';
import { Color } from 'ng2-charts/lib/color';

@Component({
   selector: 'app-cup-rating-season-details',
   templateUrl: './cup-rating-season-details.component.html',
   styleUrls: ['./cup-rating-season-details.component.scss']
})
export class CupRatingSeasonDetailsComponent implements OnInit, OnChanges {
   @Input() cupRating: CupRatingNew;

   winDrawLossChartColors: Color[];
   winDrawLossChartLabels: Label[];
   winDrawLossChartOptions: ChartOptions;
   winDrawLossChartData: SingleOrMultiDataSet;

   scoredMissedChartColors: Color[];
   scoredMissedChartData: SingleOrMultiDataSet;
   scoredMissedChartLabels: Label[];

   ngOnChanges(simpleChanges: SimpleChanges) {
      for (const propName in simpleChanges) {
         if (propName === 'cupRating' && simpleChanges[propName].currentValue) {
            const cupRating = simpleChanges[propName].currentValue as CupRatingNew;
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
      this.winDrawLossChartOptions = {
         responsive: true,
         legend: { display: false },
         scales: { yAxes: [{ ticks: { beginAtZero: true, stepSize: 1 } }] },
         tooltips: { callbacks: { label: tooltipItem => tooltipItem.yLabel as string } }
      };
   }
}
