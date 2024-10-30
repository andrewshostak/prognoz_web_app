import { Component, Input } from '@angular/core';
import { CupRatingGroup } from '@models/v2/cup/cup-rating-group.model';

@Component({
   selector: 'app-cup-rating-group-table',
   templateUrl: './cup-rating-group-table.component.html',
   styleUrls: ['./cup-rating-group-table.component.scss']
})
export class CupRatingGroupTableComponent {
   @Input() cupRatingGroup: CupRatingGroup[];
   @Input() highlightConfig: { promotion: number[]; possible_promotion: number[]; other_competition: number[] };
}
