import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { CompetitionState } from '@enums/competition-state.enum';
import { Competition } from '@models/competition.model';
import { CompetitionService } from '@services/competition.service';

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
   errorCompetitions: string;
   lastPage: number;
   noCompetitions: string;
   path = '/manage/competitions/page/';
   perPage: number;
   total: number;

   ngOnInit() {
      this.activatedRoute.params.subscribe((params: Params) => {
         this.competitionService.getCompetitions(params.number || 1).subscribe(
            response => {
               if (response.data) {
                  this.currentPage = response.current_page;
                  this.lastPage = response.last_page;
                  this.perPage = response.per_page;
                  this.total = response.total;
                  this.competitions = response.data;
               } else {
                  this.noCompetitions = 'В базі даних змагань не знайдено.';
               }
            },
            error => {
               this.errorCompetitions = error;
            }
         );
      });
   }
}
