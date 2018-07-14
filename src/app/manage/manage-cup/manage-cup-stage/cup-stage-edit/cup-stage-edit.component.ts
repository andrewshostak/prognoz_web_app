import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { CupStage } from '@models/cup/cup-stage.model';
import { CupStageService } from '@services/cup/cup-stage.service';

@Component({
    selector: 'app-cup-stage-edit',
    templateUrl: './cup-stage-edit.component.html',
    styleUrls: ['./cup-stage-edit.component.scss']
})
export class CupStageEditComponent implements OnInit {
    constructor(private activatedRoute: ActivatedRoute, private cupStageService: CupStageService) {}

    cupStage: CupStage;
    errorCupStage: string;

    ngOnInit() {
        this.activatedRoute.params.forEach((params: Params) => {
            this.getCupStageData(params['id']);
        });
    }

    private getCupStageData(cupStageId: number): void {
        this.cupStageService.getCupStage(cupStageId).subscribe(
            response => {
                this.cupStage = response;
            },
            error => {
                this.errorCupStage = error;
            }
        );
    }
}
