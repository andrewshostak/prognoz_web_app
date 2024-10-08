import { NgModule }                     from '@angular/core';
import { CommonModule }                 from '@angular/common';
import { ReactiveFormsModule }          from '@angular/forms';
import { RouterModule }                 from '@angular/router';

import { CupStagesTableComponent }      from './cup-stages-table/cup-stages-table.component';
import { CupStageCreateComponent }      from './cup-stage-create/cup-stage-create.component';
import { CupStageEditComponent }        from './cup-stage-edit/cup-stage-edit.component';
import { CupStageFormComponent }        from './shared/cup-stage-form/cup-stage-form.component';
import { ManageCupStageComponent }      from './manage-cup-stage.component';
import { SharedModule }                 from '../../../shared/shared.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
   imports: [
      CommonModule,
      ReactiveFormsModule,
      RouterModule,
      SharedModule,
      NgbTooltipModule
   ],
    declarations: [
        ManageCupStageComponent,
        CupStagesTableComponent,
        CupStageCreateComponent,
        CupStageEditComponent,
        CupStageFormComponent
    ],
})
export class ManageCupStageModule { }
