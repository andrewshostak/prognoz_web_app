import { Component, OnInit }    from '@angular/core';
import { TitleService }         from '../../core/title.service';

import { CupStageType }         from '../../shared/models/cup-stage-type.model';
import { CupStageTypeService }  from '../../core/services/cup/cup-stage-type.service';

@Component({
  selector: 'app-cup-rules',
  templateUrl: './cup-rules.component.html',
  styleUrls: ['./cup-rules.component.css']
})
export class CupRulesComponent implements OnInit {

    constructor(
        private cupStageTypeService: CupStageTypeService,
        private titleService: TitleService,
    ) { }

    cupStageTypes: CupStageType[];
    errorCupStageTypes: string;

    ngOnInit() {
        this.titleService.setTitle('Правила конкурсу - Кубок');
        this.cupStageTypeService.getCupStageTypes().subscribe(
            response => {
                this.cupStageTypes = response;
            },
            error => {
                this.errorCupStageTypes = error;
            }
        );
    }

}
