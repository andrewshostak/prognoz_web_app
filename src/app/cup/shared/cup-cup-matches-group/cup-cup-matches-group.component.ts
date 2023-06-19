import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { CupStageType } from '@enums/cup-stage-type.enum';
import { CupCupMatch } from '@models/v2/cup/cup-cup-match.model';
import { CupStage } from '@models/v2/cup/cup-stage.model';
import { CupCupMatchNewService } from '@services/v2/cup-cup-match-new.service';
import { isNil } from 'lodash';

@Component({
   selector: 'app-cup-cup-matches-group',
   templateUrl: './cup-cup-matches-group.component.html',
   styleUrls: ['./cup-cup-matches-group.component.scss']
})
export class CupCupMatchesGroupComponent implements OnChanges {
   @Input() public cupCupMatches: CupCupMatch[] = [];
   @Input() public cupStage: CupStage;

   public cupStageTypes = CupStageType;
   public groupedCupCupMatches: CupCupMatch[][] = [];
   public isNil = isNil;

   constructor(private cupCupMatchService: CupCupMatchNewService) {}

   public ngOnChanges(changes: SimpleChanges) {
      if (changes.cupCupMatches && changes.cupCupMatches.currentValue) {
         this.groupedCupCupMatches = this.cupCupMatchService.groupCupCupMatches(changes.cupCupMatches.currentValue);
      }
   }
}
