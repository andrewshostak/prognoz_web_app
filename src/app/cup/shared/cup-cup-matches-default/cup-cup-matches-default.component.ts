import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { CupStageType } from '@enums/cup-stage-type.enum';
import { CupCupMatchNew } from '@models/v2/cup-cup-match-new.model';
import { CupStageNew } from '@models/v2/cup-stage-new.model';
import { CupCupMatchNewService } from '@services/new/cup-cup-match-new.service';
import { isNil } from 'lodash';

@Component({
   selector: 'app-cup-cup-matches-default',
   templateUrl: './cup-cup-matches-default.component.html',
   styleUrls: ['./cup-cup-matches-default.component.scss']
})
export class CupCupMatchesDefaultComponent implements OnChanges {
   @Input() public cupCupMatches: CupCupMatchNew[] = [];
   @Input() public cupStage: CupStageNew;

   public cupStageTypes = CupStageType;
   public sortedCupCupMatches: CupCupMatchNew[] = [];
   public isNil = isNil;

   constructor(private cupCupMatchService: CupCupMatchNewService) {}

   public ngOnChanges(changes: SimpleChanges) {
      if (changes.cupCupMatches && changes.cupCupMatches.currentValue) {
         this.sortedCupCupMatches = this.cupCupMatchService.sortCupCupMatches(changes.cupCupMatches.currentValue);
      }
   }
}
