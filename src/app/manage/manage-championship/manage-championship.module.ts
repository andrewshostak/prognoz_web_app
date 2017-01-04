import { NgModule }                         from '@angular/core';
import { CommonModule }                     from '@angular/common';
import { ReactiveFormsModule }              from '@angular/forms';

import { DirectivesModule }                 from '../../shared/directives/directives.module';
import { ManageChampionshipComponent }      from './manage-championship.component';
import { ManageChampionshipRoutingModule }  from './manage-championship-routing.module';
import { ManageChampionshipService }        from './shared/manage-championship.service';
import { ManageChampionshipGuard }          from './shared/manage-championship-guard.service';
import { MatchCreateComponent }             from './match-create/match-create.component';
import { ChampionshipCreateComponent }      from './championship-create/championship-create.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ManageChampionshipRoutingModule,
        DirectivesModule
    ],
    declarations: [
        ManageChampionshipComponent,
        MatchCreateComponent,
        ChampionshipCreateComponent
    ],
    providers: [
        ManageChampionshipService,
        ManageChampionshipGuard
    ]
})
export class ManageChampionshipModule { }
