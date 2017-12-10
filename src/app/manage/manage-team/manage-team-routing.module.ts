import { NgModule }                     from '@angular/core';
import { RouterModule, Routes }         from '@angular/router';

import { ManageTeamComponent }          from './manage-team.component';
import { ManageTeamGuard }              from './shared/manage-team-guard.service';
import { TeamMatchCreateComponent }     from './team-match-create/team-match-create.component';
import { TeamMatchEditActiveComponent } from './team-match-edit-active/team-match-edit-active.component';
import { TeamMatchEditComponent }       from './team-match-edit/team-match-edit.component';

const routes: Routes = [
    {
        path: 'team',
        component: ManageTeamComponent,
        canActivate: [ ManageTeamGuard ],
        children: [
            {
                path: '',
                canActivateChild: [ ManageTeamGuard ],
                children: [
                    { path: 'matches/create', component: TeamMatchCreateComponent },
                    { path: 'matches/edit/active', component: TeamMatchEditActiveComponent },
                    { path: 'matches/edit', component: TeamMatchEditComponent },
        //             // { path: 'matches/edit/ended', component: TeamMatchEditEndedComponent },
        //             // { path: '', redirectTo: 'matches/edit', pathMatch: 'full'},
                ]
            }
        ]
    }
];

@NgModule({
    imports: [ RouterModule.forChild(routes) ],
    exports: [ RouterModule ]
})

export class ManageTeamRoutingModule {}