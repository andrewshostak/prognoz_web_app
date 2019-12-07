import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ManageCupCupMatchModule } from './manage-cup-cup-match/manage-cup-cup-match.module';
import { ManageCupMatchModule } from './manage-cup-match/manage-cup-match.module';
import { ManageCupRoutingModule } from './manage-cup-routing.module';
import { ManageCupStageModule } from './manage-cup-stage/manage-cup-stage.module';
import { ManageCupComponent } from './manage-cup.component';

@NgModule({
   imports: [CommonModule, ManageCupCupMatchModule, ManageCupMatchModule, ManageCupStageModule, ManageCupRoutingModule],
   declarations: [ManageCupComponent]
})
export class ManageCupModule {}
