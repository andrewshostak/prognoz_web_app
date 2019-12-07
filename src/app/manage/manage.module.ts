import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ManageChampionshipModule } from '@app/manage/manage-championship/manage-championship.module';
import { ManageClubModule } from '@app/manage/manage-club/manage-club.module';
import { ManageCompetitionModule } from '@app/manage/manage-competition/manage-competition.module';
import { ManageCupModule } from '@app/manage/manage-cup/manage-cup.module';
import { ManageMatchModule } from '@app/manage/manage-match/manage-match.module';
import { ManageNewsModule } from '@app/manage/manage-news/manage-news.module';
import { ManageRoutingModule } from '@app/manage/manage-routing.module';
import { ManageTeamModule } from '@app/manage/manage-team/manage-team.module';
import { ManageComponent } from '@app/manage/manage.component';
import { ManageGuard } from '@app/manage/shared/manage-guard.service';
import { RoleGuard } from '@app/manage/shared/role-guard.service';

@NgModule({
   declarations: [ManageComponent],
   exports: [ManageComponent],
   imports: [
      CommonModule,
      ManageMatchModule,
      ManageNewsModule,
      ManageChampionshipModule,
      ManageClubModule,
      ManageCupModule,
      ManageCompetitionModule,
      ManageTeamModule,
      ManageRoutingModule
   ],
   providers: [ManageGuard, RoleGuard]
})
export class ManageModule {}
