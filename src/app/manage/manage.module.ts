import { NgModule }                 from '@angular/core';
import { CommonModule }             from '@angular/common';

import { ManageComponent }          from './manage.component';
import { ManageNewsModule }         from './manage-news/manage-news.module';
import { ManageClubModule }         from './manage-club/manage-club.module';
import { ManageChampionshipModule } from './manage-championship/manage-championship.module';
import { ManageSeasonModule }       from './manage-season/manage-season.module';
import { ManageGuard }              from './shared/manage-guard.service';
import { ManageRoutingModule }      from './manage-routing.module';
import { CompetitionService }       from './shared/competition.service';

@NgModule({
    imports: [
        CommonModule,
        ManageNewsModule,
        ManageClubModule,
        ManageChampionshipModule,
        ManageSeasonModule,
        ManageRoutingModule
    ],
    declarations: [
        ManageComponent
    ],
    providers: [
        ManageGuard,
        CompetitionService
    ],
    exports: [
        ManageComponent
    ]
})
export class ManageModule { }
