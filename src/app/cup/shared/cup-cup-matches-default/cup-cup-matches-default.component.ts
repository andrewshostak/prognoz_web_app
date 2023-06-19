import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { CupStageType } from '@enums/cup-stage-type.enum';
import { CupCupMatch } from '@models/v2/cup/cup-cup-match.model';
import { CupStage } from '@models/v2/cup/cup-stage.model';
import { CupCupMatchService } from '@services/v2/cup-cup-match.service';
import { isNil } from 'lodash';

@Component({
   selector: 'app-cup-cup-matches-default',
   templateUrl: './cup-cup-matches-default.component.html',
   styleUrls: ['./cup-cup-matches-default.component.scss']
})
export class CupCupMatchesDefaultComponent implements OnChanges {
   @Input() public cupCupMatches: CupCupMatch[] = [];
   @Input() public cupStage: CupStage;

   public cupStageTypes = CupStageType;
   public sortedCupCupMatches: CupCupMatch[] = [];
   public isNil = isNil;

   constructor(private cupCupMatchService: CupCupMatchService) {}

   public ngOnChanges(changes: SimpleChanges) {
      if (changes.cupCupMatches && changes.cupCupMatches.currentValue) {
         this.sortedCupCupMatches = this.cupCupMatchService.sortCupCupMatches(changes.cupCupMatches.currentValue);
      }
   }
}
