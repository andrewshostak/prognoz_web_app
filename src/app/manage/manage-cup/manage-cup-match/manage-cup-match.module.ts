import { NgModule }                         from '@angular/core';
import { CommonModule }                     from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule }                     from '@angular/router';

import { ManageCupMatchComponent }          from './manage-cup-match.component';
import { SharedModule }                     from '../../../shared/shared.module';
import { CupMatchCreateComponent }          from './cup-match-create/cup-match-create.component';
import { CupMatchEditComponent }            from './cup-match-edit/cup-match-edit.component';
import { CupMatchFormComponent }            from './shared/cup-match-form/cup-match-form.component';
import { CupMatchTableComponent }           from './cup-match-table/cup-match-table.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        SharedModule
    ],
    declarations: [
        ManageCupMatchComponent,
        CupMatchCreateComponent,
        CupMatchEditComponent,
        CupMatchFormComponent,
        CupMatchTableComponent
    ]
})
export class ManageCupMatchModule { }
