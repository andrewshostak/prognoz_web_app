import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';

import { CupRatingCalculated } from '@models/v2/cup/cup-rating-calculated.model';
import { CupRating } from '@models/v2/cup/cup-rating.model';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { cloneDeep } from 'lodash';
import { Color } from 'ng2-charts/lib/color';
import { Label } from 'ng2-charts/lib/base-chart.directive';

@Component({
   selector: 'app-cup-rating-seasons-summary',
   templateUrl: './cup-rating-seasons-summary.component.html',
   styleUrls: ['./cup-rating-seasons-summary.component.scss']
})
export class CupRatingSeasonsSummaryComponent implements OnInit, OnChanges {
   @Input() cupRating: CupRatingCalculated;

   winDrawLossChartColors: Color[];
   winDrawLossChartData: ChartDataSets[];
   winDrawLossChartLabels: Label[];
   winDrawLossChartOptions: ChartOptions;

   ngOnChanges(simpleChanges: SimpleChanges) {
      for (const propName in simpleChanges) {
         if (propName === 'cupRating' && simpleChanges[propName].currentValue) {
            const cupRating = cloneDeep(simpleChanges[propName].currentValue) as CupRatingCalculated;
            this.winDrawLossChartLabels = [];
            this.winDrawLossChartData = [
               { data: [], label: 'Виграші' },
               { data: [], label: 'Нічиї' },
               { data: [], label: 'Програші' }
            ];
            cupRating.rating_items.sort(this.sortBySeasonFunc).forEach(ratingItem => {
               this.winDrawLossChartLabels.push(ratingItem.season.title);
               this.winDrawLossChartData[0].data.push(ratingItem.win);
               this.winDrawLossChartData[1].data.push(ratingItem.draw);
               this.winDrawLossChartData[2].data.push(ratingItem.loss);
            });
         }
      }
   }

   ngOnInit() {
      this.winDrawLossChartColors = [{ backgroundColor: '#28a745' }, { backgroundColor: '#ffc107' }, { backgroundColor: '#dc3545' }];
      this.winDrawLossChartOptions = {
         responsive: true,
         scales: { yAxes: [{ ticks: { beginAtZero: true, stepSize: 1 } }] }
      };
   }

   private sortBySeasonFunc(a: CupRating, b: CupRating): number {
      return a.season.title < b.season.title ? -1 : 1;
   }
}
