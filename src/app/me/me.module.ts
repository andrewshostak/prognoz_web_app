import { CommonModule }         from '@angular/common';
import { NgModule }             from '@angular/core';
import { ReactiveFormsModule }  from '@angular/forms';

import { MeComponent }          from './me.component';
import { MeGuard }              from './me-guard.service';
import { MeRoutingModule }      from './me-routing.module';
import { SharedModule }         from '../shared/shared.module';

@NgModule({
    imports: [
        CommonModule,
        MeRoutingModule,
        ReactiveFormsModule,
        SharedModule
    ],
    declarations: [
        MeComponent
    ],
    providers: [
        MeGuard
    ]
})
export class MeModule { }
