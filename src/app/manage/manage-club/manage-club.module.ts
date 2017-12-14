import { CommonModule }              from '@angular/common';
import { NgModule }                  from '@angular/core';
import { ReactiveFormsModule }       from '@angular/forms';

import { ClubCreateComponent }       from './club-create/club-create.component';
import { ClubEditComponent }         from './club-edit/club-edit.component';
import { ClubTableComponent }        from './club-table/club-table.component';
import { ManageClubComponent }       from './manage-club.component';
import { ManageClubGuard }           from './shared/manage-club-guard.service';
import { ManageClubRoutingModule }   from './manage-club-routing.module';
import { SharedModule }              from '../../shared/shared.module';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ManageClubRoutingModule,
        SharedModule
    ],
    declarations: [
        ManageClubComponent,
        ClubTableComponent,
        ClubCreateComponent,
        ClubEditComponent
    ],
    providers: [
        ManageClubGuard
    ]
})
export class ManageClubModule { }
