import { NgModule }             from '@angular/core';
import { CommonModule }         from '@angular/common';
import { ReactiveFormsModule }  from '@angular/forms';
import { RouterModule }         from '@angular/router';

import { CupCupMatchCreateComponent }       from './cup-cup-match-create/cup-cup-match-create.component';
import { CupCupMatchEditComponent }         from './cup-cup-match-edit/cup-cup-match-edit.component';
import { CupCupMatchesCreateAutoComponent } from './cup-cup-matches-create-auto/cup-cup-matches-create-auto.component';
import { CupCupMatchesTableComponent }      from './cup-cup-matches-table/cup-cup-matches-table.component';
import { CupCupMatchFormComponent }         from './shared/cup-cup-match-form/cup-cup-match-form.component';
import { ManageCupCupMatchComponent }       from './manage-cup-cup-match.component';
import { SharedModule }                     from '../../../shared/shared.module';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule,
        SharedModule
    ],
    declarations: [
        CupCupMatchCreateComponent,
        CupCupMatchEditComponent,
        CupCupMatchesTableComponent,
        CupCupMatchesCreateAutoComponent,
        CupCupMatchFormComponent,
        ManageCupCupMatchComponent,
    ]
})
export class ManageCupCupMatchModule { }
