import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { ChampionshipMatch } from '@models/v2/championship/championship-match.model';
import { ChampionshipMatchService } from '@services/api/v2/championship/championship-match.service';

@Component({
   selector: 'app-championship-match-update',
   styleUrls: ['./championship-match-edit.component.scss'],
   templateUrl: './championship-match-edit.component.html'
})
export class ChampionshipMatchEditComponent implements OnInit {
   public championshipMatch: ChampionshipMatch;

   constructor(private activatedRoute: ActivatedRoute, private championshipMatchService: ChampionshipMatchService) {}

   public ngOnInit(): void {
      this.activatedRoute.params.forEach((param: Params) => {
         this.championshipMatchService.getChampionshipMatch(param.id).subscribe(response => {
            this.championshipMatch = response;
         });
      });
   }
}
