import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { Tournament } from '@enums/tournament.enum';
import { TitleService } from '@services/title.service';
import { CompetitionService } from '@services/v2/competition.service';
import { Competition } from '@models/v2/competition.model';
import { CompetitionSearch } from '@models/search/competition-search.model';
import { PaginationService } from '@services/pagination.service';

@Component({
   selector: 'app-championship-competitions',
   templateUrl: './championship-competitions.component.html',
   styleUrls: ['./championship-competitions.component.scss']
})
export class ChampionshipCompetitionsComponent implements OnInit {
   constructor(
      private activatedRoute: ActivatedRoute,
      private competitionService: CompetitionService,
      private titleService: TitleService
   ) {}

   competitions: Competition[] = [];

   ngOnInit() {
      this.activatedRoute.params.forEach((params: Params) => {
         this.titleService.setTitle(`Конкурси сезону ${params.id} - Чемпіонат`);
         const search: CompetitionSearch = {
            tournamentId: Tournament.Championship,
            seasonId: params.id,
            page: 1,
            limit: PaginationService.limit.competitions
         };
         this.competitions = [];
         this.competitionService.getCompetitions(search).subscribe(response => (this.competitions = response.data));
      });
   }
}
