import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { CupMatchService } from '../../../../core/services/cup/cup-match.service';
import { CupMatch } from '../../../../shared/models/cup-match.model';

@Component({
  selector: 'app-cup-match-edit',
  templateUrl: './cup-match-edit.component.html',
  styleUrls: ['./cup-match-edit.component.css']
})
export class CupMatchEditComponent implements OnInit {

    constructor(
        private activatedRoute: ActivatedRoute,
        private cupMatchService: CupMatchService
    ) { }

    cupMatch: CupMatch;
    errorCupMatch: string;

    ngOnInit() {
        this.activatedRoute.params.forEach((params: Params) => {
            this.getCupMatchData(params['id']);
        });
    }

    private getCupMatchData(cupMatchId: number): void {
        this.cupMatchService.getCupMatch(cupMatchId).subscribe(
            response => {
                this.cupMatch = response;
            },
            error => {
                this.errorCupMatch = error;
            }
        );
    }

}
