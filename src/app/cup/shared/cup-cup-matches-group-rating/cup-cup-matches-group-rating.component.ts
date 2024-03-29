import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CupRatingGroupTab } from '@enums/cup-rating-group-tab.enum';
import { CupCupMatchState } from '@enums/cup-cup-match-state.enum';
import { Sequence } from '@enums/sequence.enum';
import { CupCompetitionService } from '@services/cup-competition.service';
import { CupCupMatch } from '@models/v2/cup/cup-cup-match.model';
import { CupCupMatchSearch } from '@models/search/cup/cup-cup-match-search.model';
import { CupCupMatchService } from '@services/api/v2/cup/cup-cup-match.service';
import { PaginationService } from '@services/pagination.service';
import { isNil } from 'lodash';

@Component({
   selector: 'app-cup-rating-group-matches',
   templateUrl: './cup-cup-matches-group-rating.component.html',
   styleUrls: ['./cup-cup-matches-group-rating.component.scss']
})
export class CupCupMatchesGroupRatingComponent implements OnChanges {
   @Input() public competitionId: number;
   @Input() public groupNumber: number;
   @Input() public tab: CupRatingGroupTab;

   public cupRatingGroupTab = CupRatingGroupTab;
   public groupedCupCupMatches: CupCupMatch[][] = [];
   public isNil = isNil;
   public isLoading: boolean = false;

   private search: CupCupMatchSearch = {
      cupPredictionsCount: true,
      limit: PaginationService.limit.cupCupMatches,
      page: 1,
      relations: ['homeUser', 'awayUser', 'cupStage']
   };

   constructor(
      private activatedRoute: ActivatedRoute,
      private cupCupMatchService: CupCupMatchService,
      private cupCompetitionService: CupCompetitionService,
      private router: Router
   ) {}

   public ngOnChanges(changes: SimpleChanges) {
      if (changes) {
         const isActiveTab = this.tab === CupRatingGroupTab.Active;
         const search: CupCupMatchSearch = {
            ...this.search,
            groupNumber: this.groupNumber,
            competitionId: this.competitionId,
            states: isActiveTab ? [CupCupMatchState.Active, CupCupMatchState.NotStarted] : [CupCupMatchState.Ended]
         };
         this.isLoading = true;
         this.cupCupMatchService.getCupCupMatches(search).subscribe(
            response => {
               this.isLoading = false;
               const sequence = isActiveTab ? Sequence.Ascending : Sequence.Descending;
               this.groupedCupCupMatches = this.cupCompetitionService.groupCupCupMatchesByStage(response.data, sequence);
            },
            () => (this.isLoading = false)
         );
      }
   }

   public selectTab(tab: CupRatingGroupTab): void {
      this.router.navigate([], { queryParams: { tab }, queryParamsHandling: 'merge', relativeTo: this.activatedRoute });
   }
}
