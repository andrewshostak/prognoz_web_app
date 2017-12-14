import { CommonModule }                     from '@angular/common';
import { NgModule }                         from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ManageTeamComponent }              from './manage-team.component';
import { ManageTeamGuard }                  from './shared/manage-team-guard.service';
import { ManageTeamRoutingModule }          from './manage-team-routing.module';
import { SharedModule }                     from '../../shared/shared.module';
import { TeamMatchCreateComponent }         from './team-match-create/team-match-create.component';
import { TeamMatchEditActiveComponent }     from './team-match-edit-active/team-match-edit-active.component';
import { TeamMatchEditComponent }           from './team-match-edit/team-match-edit.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ManageTeamRoutingModule,
        ReactiveFormsModule,
        SharedModule,
    ],
    declarations: [
        ManageTeamComponent,
        TeamMatchCreateComponent,
        TeamMatchEditActiveComponent,
        TeamMatchEditComponent,
    ],
    providers: [
        ManageTeamGuard
    ]
})
export class ManageTeamModule { }