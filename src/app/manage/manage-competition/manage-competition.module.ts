import { CommonModule }                     from '@angular/common';
import { NgModule }                         from '@angular/core';
import { ReactiveFormsModule }              from '@angular/forms';

import { CompetitionCreateComponent }       from './competition-create/competition-create.component';
import { CompetitionEditComponent }         from './competition-edit/competition-edit.component';
import { CompetitionFormComponent }         from './shared/competition-form/competition-form.component';
import { CompetitionTableComponent }        from './competition-table/competition-table.component';
import { SharedModule }                     from '../../shared/shared.module';
import { ManageCompetitionComponent }       from './manage-competition.component';
import { ManageCompetitionGuard }           from './shared/manage-competition-guard.service';
import { ManageCompetitionRoutingModule }   from './manage-competition-routing.module';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SharedModule,
        ManageCompetitionRoutingModule
    ],
    declarations: [
        CompetitionCreateComponent,
        CompetitionEditComponent,
        CompetitionFormComponent,
        CompetitionTableComponent,
        ManageCompetitionComponent,
    ],
    providers: [
        ManageCompetitionGuard
    ],
})
export class ManageCompetitionModule { }
