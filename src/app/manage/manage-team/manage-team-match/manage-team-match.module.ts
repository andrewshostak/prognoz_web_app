import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ManageTeamMatchComponent } from './manage-team-match.component';
import { SharedModule } from '../../../shared/shared.module';
import { TeamMatchCreateComponent } from './team-match-create/team-match-create.component';
import { TeamMatchEditComponent } from './team-match-edit/team-match-edit.component';
import { TeamMatchesTableComponent } from './team-matches-table/team-matches-table.component';
import { TeamMatchFormComponent } from './shared/team-match-form/team-match-form.component';

@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, SharedModule],
    declarations: [
        ManageTeamMatchComponent,
        TeamMatchesTableComponent,
        TeamMatchCreateComponent,
        TeamMatchEditComponent,
        TeamMatchFormComponent
    ]
})
export class ManageTeamMatchModule {}
