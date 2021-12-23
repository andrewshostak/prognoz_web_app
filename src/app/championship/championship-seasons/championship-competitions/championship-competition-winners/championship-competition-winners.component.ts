import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Tournament } from '@enums/tournament.enum';
import { CompetitionNew } from '@models/new/competition-new.model';
import { CompetitionNewService } from '@services/new/competition-new.service';
import { TitleService } from '@services/title.service';
import { SettingsService } from '@services/settings.service';

@Component({
   selector: 'app-championship-competition-winners',
   templateUrl: './championship-competition-winners.component.html',
   styleUrls: ['./championship-competition-winners.component.scss']
})
export class ChampionshipCompetitionWinnersComponent implements OnInit {
   constructor(
      private activatedRoute: ActivatedRoute,
      private competitionService: CompetitionNewService,
      private router: Router,
      private titleService: TitleService
   ) {}

   awardsLogosPath: string = SettingsService.awardsLogosPath + '/';
   competition: CompetitionNew;

   ngOnInit() {
      this.activatedRoute.params.forEach((params: Params) => {
         this.competition = null;
         this.competitionService.getCompetition(params.competitionId, ['winners.user', 'winners.award']).subscribe(response => {
            if (response.tournament_id !== Tournament.Championship) {
               this.router.navigate(['/404']);
            }

            this.titleService.setTitle(`Переможці конкурсу ${response.title} - Чемпіонат`);
            this.competition = response;
         });
      });
   }
}
