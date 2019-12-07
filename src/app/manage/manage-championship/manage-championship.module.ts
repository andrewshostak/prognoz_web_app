import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ManageChampionshipMatchModule } from '@app/manage/manage-championship/manage-championship-match/manage-championship-match.module';
import { ManageChampionshipRoutingModule } from '@app/manage/manage-championship/manage-championship-routing.module';
import { ManageChampionshipComponent } from '@app/manage/manage-championship/manage-championship.component';

@NgModule({
   declarations: [ManageChampionshipComponent],
   imports: [CommonModule, ManageChampionshipMatchModule, ManageChampionshipRoutingModule]
})
export class ManageChampionshipModule {}
