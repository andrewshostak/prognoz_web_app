import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ManageChampionshipMatchModule } from '@app/manage/manage-championship/manage-championship-match/manage-championship-match.module';
import { ManageChampionshipRoutingModule } from '@app/manage/manage-championship/manage-championship-routing.module';
import { ManageChampionshipComponent } from '@app/manage/manage-championship/manage-championship.component';
import { ManageChampionshipGuard } from '@app/manage/manage-championship/shared/manage-championship-guard.service.service';

@NgModule({
   declarations: [ManageChampionshipComponent],
   imports: [CommonModule, ManageChampionshipMatchModule, ManageChampionshipRoutingModule],
   providers: [ManageChampionshipGuard]
})
export class ManageChampionshipModule {}
