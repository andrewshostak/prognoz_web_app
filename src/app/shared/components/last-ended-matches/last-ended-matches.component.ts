import { Component, OnInit } from '@angular/core';

import { ModelStatus } from '@enums/model-status.enum';
import { Sequence } from '@enums/sequence.enum';
import { ChampionshipMatchNew } from '@models/new/championship-match-new.model';
import { ChampionshipMatchSearch } from '@models/search/championship-match-search.model';
import { ChampionshipMatchNewService } from '@services/new/championship-match-new.service';

@Component({
   selector: 'app-last-ended-matches',
   styleUrls: ['./last-ended-matches.component.scss'],
   templateUrl: './last-ended-matches.component.html'
})
export class LastEndedMatchesComponent implements OnInit {
   public championshipMatches: ChampionshipMatchNew[];
   public clubsLogosPath: string;

   constructor(private championshipMatchService: ChampionshipMatchNewService) {}

   public getChampionshipMatchesData(): void {
      const search: ChampionshipMatchSearch = {
         ended: ModelStatus.Truthy,
         limit: 5,
         orderBy: 'started_at',
         page: 1,
         sequence: Sequence.Descending
      };
      this.championshipMatchService.getChampionshipMatches(search).subscribe(response => {
         this.championshipMatches = response.data;
      });
   }

   public ngOnInit(): void {
      this.getChampionshipMatchesData();
   }
}
