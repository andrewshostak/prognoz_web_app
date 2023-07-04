import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { Match } from '@models/v2/match.model';
import { MatchService } from '@services/api/v2/match.service';

@Component({
   selector: 'app-match-edit',
   styleUrls: ['./match-edit.component.scss'],
   templateUrl: './match-edit.component.html'
})
export class MatchEditComponent implements OnInit {
   public match: Match;

   constructor(private activatedRoute: ActivatedRoute, private matchService: MatchService) {}

   public ngOnInit() {
      this.activatedRoute.params.forEach((param: Params) => {
         this.matchService.getMatch(param.id).subscribe(response => {
            this.match = response;
         });
      });
   }
}
