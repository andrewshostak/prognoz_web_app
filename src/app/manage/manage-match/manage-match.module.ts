import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ManageMatchRoutingModule } from '@app/manage/manage-match/manage-match-routing.module';
import { ManageMatchComponent } from '@app/manage/manage-match/manage-match.component';
import { MatchTableComponent } from '@app/manage/manage-match/match-table/match-table.component';
import { ManageMatchGuard } from '@app/manage/manage-match/shared/manage-match-guard.service';
import { SharedModule } from '@app/shared/shared.module';

@NgModule({
   declarations: [ManageMatchComponent, MatchTableComponent],
   imports: [CommonModule, SharedModule, ManageMatchRoutingModule],
   providers: [ManageMatchGuard]
})
export class ManageMatchModule {}
