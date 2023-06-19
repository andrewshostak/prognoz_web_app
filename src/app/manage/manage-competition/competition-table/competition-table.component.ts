import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { CompetitionState } from '@enums/competition-state.enum';
import { Competition } from '@models/v2/competition.model';
import { CompetitionService } from '@services/v2/competition.service';
import { SettingsService } from '@services/settings.service';
import { CompetitionSearch } from '@models/search/competition-search.model';

@Component({
   selector: 'app-competition-table',
   templateUrl: './competition-table.component.html',
   styleUrls: ['./competition-table.component.scss']
})
export class CompetitionTableComponent implements OnInit {
   constructor(private activatedRoute: ActivatedRoute, private competitionService: CompetitionService) {}

   competitions: Competition[];
   competitionStates = CompetitionState;
   currentPage: number;
   lastPage: number;
   path = '/manage/competitions/page/';
   perPage: number;
   total: number;

   ngOnInit() {
      this.activatedRoute.params.subscribe((params: Params) => {
         const search: CompetitionSearch = {
            relations: ['season', 'tournament'],
            page: params.number || 1,
            limit: SettingsService.competitionsPerPage
         };
         this.competitionService.getCompetitions(search).subscribe(response => {
            this.currentPage = response.current_page;
            this.lastPage = response.last_page;
            this.perPage = response.per_page;
            this.total = response.total;
            this.competitions = response.data;
         });
      });
   }
}
