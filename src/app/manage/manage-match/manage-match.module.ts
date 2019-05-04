import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageMatchComponent } from './manage-match.component';
import { MatchTableComponent } from './match-table/match-table.component';
import { SharedModule } from '../../shared/shared.module';
import { ManageMatchRoutingModule } from './manage-match-routing.module';
import { ManageMatchGuard } from './shared/manage-match-guard.service';

@NgModule({
    declarations: [ManageMatchComponent, MatchTableComponent],
    imports: [CommonModule, SharedModule, ManageMatchRoutingModule],
    providers: [ManageMatchGuard]
})
export class ManageMatchModule {}
