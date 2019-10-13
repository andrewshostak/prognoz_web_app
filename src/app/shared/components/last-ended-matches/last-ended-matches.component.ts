import { Component, OnInit } from '@angular/core';

import { ModelStatus } from '@enums/model-status.enum';
import { Sequence } from '@enums/sequence.enum';
import { Match } from '@models/match.model';
import { MatchSearch } from '@models/search/match-search.model';
import { MatchService } from '@services/new/match.service';

@Component({
   selector: 'app-last-ended-matches',
   styleUrls: ['./last-ended-matches.component.scss'],
   templateUrl: './last-ended-matches.component.html'
})
export class LastEndedMatchesComponent implements OnInit {
   public matches: Match[];

   constructor(private matchService: MatchService) {}

   public getMatchesData(): void {
      const search: MatchSearch = {
         ended: ModelStatus.Truthy,
         limit: 5,
         orderBy: 'started_at',
         page: 1,
         sequence: Sequence.Descending
      };
      this.matchService.getMatches(search).subscribe(response => {
         this.matches = response.data;
      });
   }

   public ngOnInit(): void {
      this.getMatchesData();
   }
}
