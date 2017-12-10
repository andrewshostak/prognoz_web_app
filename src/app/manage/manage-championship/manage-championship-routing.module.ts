import { NgModule }                         from '@angular/core';
import { RouterModule, Routes }             from '@angular/router';

import { ManageChampionshipComponent }      from './manage-championship.component';
import { ManageChampionshipGuard }          from './shared/manage-championship-guard.service';
import { MatchCreateComponent }             from './match-create/match-create.component';
import { MatchEditActiveComponent }         from './match-edit-active/match-edit-active.component';
import { MatchEditComponent }               from './match-edit/match-edit.component';
import { MatchEditEndedComponent }          from './match-edit-ended/match-edit-ended.component';

const routes: Routes = [
    {
        path: 'championship',
        component: ManageChampionshipComponent,
        canActivate: [ ManageChampionshipGuard ],
        children: [
            {
                path: '',
                canActivateChild: [ ManageChampionshipGuard ],
                children: [
                    { path: 'matches/create', component: MatchCreateComponent },
                    { path: 'matches/edit', component: MatchEditComponent },
                    { path: 'matches/edit/active', component: MatchEditActiveComponent },
                    { path: 'matches/edit/ended', component: MatchEditEndedComponent }
                ]
            }
        ]
    }
];

@NgModule({
    imports: [ RouterModule.forChild(routes) ],
    exports: [ RouterModule ]
})

export class ManageChampionshipRoutingModule {}