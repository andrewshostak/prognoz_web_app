import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { CupStageType } from '@enums/cup-stage-type.enum';
import { CupCupMatch } from '@models/v2/cup/cup-cup-match.model';
import { CupStage } from '@models/v2/cup/cup-stage.model';
import { CupCupMatchNewService } from '@services/v2/cup-cup-match-new.service';
import { isNil } from 'lodash';

@Component({
   selector: 'app-cup-cup-matches-two-rounds',
   templateUrl: './cup-cup-matches-two-rounds.component.html',
   styleUrls: ['./cup-cup-matches-two-rounds.component.scss']
})
export class CupCupMatchesTwoRoundsComponent implements OnChanges {
   @Input() public cupCupMatches: CupCupMatch[] = [];
   @Input() public cupStage: CupStage;
   @Input() public cupCupMatchesOfFirstStage: CupCupMatch[] = [];

   public cupStageTypes = CupStageType;
   public isNil = isNil;
   public wrappedCupCupMatches: { current: CupCupMatch; first: CupCupMatch }[] = [];

   constructor(private cupCupMatchService: CupCupMatchNewService) {}

   public ngOnChanges(changes: SimpleChanges) {
      if (changes.cupCupMatches && changes.cupCupMatches.currentValue) {
         const sorted = this.cupCupMatchService.sortCupCupMatches(this.cupCupMatches);
         const sortedFirst = this.cupCupMatchService.sortCupCupMatches(this.cupCupMatchesOfFirstStage);
         this.wrappedCupCupMatches = this.wrapCupCupMatches(sorted, sortedFirst);
      }
      if (changes.cupCupMatchesOfFirstStage && changes.cupCupMatchesOfFirstStage.currentValue) {
         const sorted = this.cupCupMatchService.sortCupCupMatches(this.cupCupMatches);
         const sortedFirst = this.cupCupMatchService.sortCupCupMatches(this.cupCupMatchesOfFirstStage);
         this.wrappedCupCupMatches = this.wrapCupCupMatches(sorted, sortedFirst);
      }
   }

   public wrapCupCupMatches(current: CupCupMatch[] = [], first: CupCupMatch[] = []): { current: CupCupMatch; first: CupCupMatch }[] {
      return current.reduce((acc, cupCupMatch) => {
         acc.push({
            current: cupCupMatch,
            first: first.find(
               cupCupMatchFirst =>
                  cupCupMatchFirst.home_user_id === cupCupMatch.away_user_id && cupCupMatchFirst.away_user_id === cupCupMatch.home_user_id
            )
         });

         return acc;
      }, []);
   }
}
