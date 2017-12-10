import { NgModule }                 from '@angular/core';
import { RouterModule, Routes }     from '@angular/router';

import { ClubCreateComponent }      from './club-create/club-create.component';
import { ClubEditComponent }        from './club-edit/club-edit.component';
import { ClubTableComponent }       from './club-table/club-table.component';
import { ManageClubGuard }          from './shared/manage-club-guard.service';
import { ManageClubComponent }      from './manage-club.component';

const routes: Routes = [
    {
        path: 'clubs',
        component: ManageClubComponent,
        canActivate: [ ManageClubGuard ],
        children: [
            {
                path: '',
                canActivateChild: [ ManageClubGuard ],
                children: [
                    { path: 'page/:number', component: ClubTableComponent },
                    { path: 'create', component: ClubCreateComponent },
                    { path: ':id/edit', component: ClubEditComponent },
                    { path: '', component: ClubTableComponent }
                ]
            }
        ]
    }
];

@NgModule({
    imports: [ RouterModule.forChild(routes) ],
    exports: [ RouterModule ]
})

export class ManageClubRoutingModule {}