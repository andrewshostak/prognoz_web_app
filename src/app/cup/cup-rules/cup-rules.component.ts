import { Component, OnInit } from '@angular/core';
import { TitleService } from '@services/title.service';

import { CupStageType } from '@models/v2/cup/cup-stage-type.model';
import { CupStageTypeService } from '@services/v2/cup/cup-stage-type.service';
import { sortBy } from 'lodash';

@Component({
   selector: 'app-cup-rules',
   templateUrl: './cup-rules.component.html',
   styleUrls: ['./cup-rules.component.scss']
})
export class CupRulesComponent implements OnInit {
   constructor(private cupStageTypeService: CupStageTypeService, private titleService: TitleService) {}

   cupStageTypes: CupStageType[];

   ngOnInit() {
      this.titleService.setTitle('Правила конкурсу - Кубок');
      this.cupStageTypeService
         .getCupStageTypes()
         .subscribe(response => (this.cupStageTypes = sortBy(response.data, ['coefficient', 'title'])));
   }
}
