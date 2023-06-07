import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { Tournament } from '@enums/tournament.enum';
import { TitleService } from '@services/title.service';
import { CompetitionNewService } from '@services/new/competition-new.service';
import { CompetitionNew } from '@models/v2/competition-new.model';
import { CompetitionSearch } from '@models/search/competition-search.model';
import { SettingsService } from '@services/settings.service';

@Component({
   selector: 'app-championship-competitions',
   templateUrl: './championship-competitions.component.html',
   styleUrls: ['./championship-competitions.component.scss']
})
export class ChampionshipCompetitionsComponent implements OnInit {
   constructor(
      private activatedRoute: ActivatedRoute,
      private competitionService: CompetitionNewService,
      private titleService: TitleService
   ) {}

   competitions: CompetitionNew[] = [];

   ngOnInit() {
      this.activatedRoute.params.forEach((params: Params) => {
         this.titleService.setTitle(`Конкурси сезону ${params.id} - Чемпіонат`);
         const search: CompetitionSearch = {
            tournamentId: Tournament.Championship,
            seasonId: params.id,
            page: 1,
            limit: SettingsService.maxLimitValues.competitions
         };
         this.competitions = [];
         this.competitionService.getCompetitions(search).subscribe(response => (this.competitions = response.data));
      });
   }
}
