import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ManageTeamTeamComponent } from '@app/manage/manage-team/manage-team-team/manage-team-team.component';
import { ManageTeamTeamGuard } from '@app/manage/manage-team/manage-team-team/shared/manage-team-team-guard.service';
import { TeamCreateComponent } from '@app/manage/manage-team/manage-team-team/team-create/team-create.component';
import { TeamTeamsTableComponent } from '@app/manage/manage-team/manage-team-team/team-teams-table/team-teams-table.component';
import { SharedModule } from '@app/shared/shared.module';

@NgModule({
   declarations: [ManageTeamTeamComponent, TeamTeamsTableComponent, TeamCreateComponent],
   imports: [CommonModule, RouterModule, SharedModule],
   providers: [ManageTeamTeamGuard]
})
export class ManageTeamTeamModule {}
