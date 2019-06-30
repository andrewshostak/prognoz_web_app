import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { ChampionshipMatchNew } from '@models/new/championship-match-new.model';
import { ChampionshipMatchNewService } from '@services/new/championship-match-new.service';

@Component({
   selector: 'app-championship-match-update',
   styleUrls: ['./championship-match-edit.component.scss'],
   templateUrl: './championship-match-edit.component.html'
})
export class ChampionshipMatchEditComponent implements OnInit {
   public championshipMatch: ChampionshipMatchNew;

   constructor(private activatedRoute: ActivatedRoute, private championshipMatchService: ChampionshipMatchNewService) {}

   public ngOnInit(): void {
      this.activatedRoute.params.forEach((param: Params) => {
         this.championshipMatchService.getChampionshipMatch(param.id).subscribe(response => {
            this.championshipMatch = response;
         });
      });
   }
}