import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { CupCupMatchService } from '@services/cup/cup-cup-match.service';
import { CupCupMatch } from '@models/cup/cup-cup-match.model';

@Component({
    selector: 'app-cup-cup-match-edit',
    templateUrl: './cup-cup-match-edit.component.html',
    styleUrls: ['./cup-cup-match-edit.component.scss']
})
export class CupCupMatchEditComponent implements OnInit {
    constructor(private activatedRoute: ActivatedRoute, private cupCupMatchService: CupCupMatchService) {}

    cupCupMatch: CupCupMatch;
    errorCupCupMatch: string;

    ngOnInit() {
        this.activatedRoute.params.forEach((params: Params) => {
            this.getCupCupMatchData(params['id']);
        });
    }

    private getCupCupMatchData(cupCupMatchId: number): void {
        this.cupCupMatchService.getCupCupMatch(cupCupMatchId).subscribe(
            response => {
                this.cupCupMatch = response;
            },
            error => {
                this.errorCupCupMatch = error;
            }
        );
    }
}
