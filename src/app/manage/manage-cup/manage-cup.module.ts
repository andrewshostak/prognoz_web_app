import { NgModule }                 from '@angular/core';
import { CommonModule }             from '@angular/common';

import { ManageCupGuard }           from './shared/manage-cup-stage-guard.service';
import { ManageCupComponent }       from './manage-cup.component';
import { ManageCupCupMatchModule }  from './manage-cup-cup-match/manage-cup-cup-match.module';
import { ManageCupMatchModule }     from './manage-cup-match/manage-cup-match.module';
import { ManageCupRoutingModule }   from './manage-cup-routing.module';
import { ManageCupStageModule }     from './manage-cup-stage/manage-cup-stage.module';

@NgModule({
    imports: [
        CommonModule,
        ManageCupCupMatchModule,
        ManageCupMatchModule,
        ManageCupStageModule,
        ManageCupRoutingModule
    ],
    declarations: [
        ManageCupComponent,
    ],
    providers: [
        ManageCupGuard
    ]
})
export class ManageCupModule { }
