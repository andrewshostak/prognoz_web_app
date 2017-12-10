import { NgModule }                 from '@angular/core';
import { RouterModule, Routes }     from '@angular/router';

import { ManageSeasonComponent }    from './manage-season.component';
import { ManageSeasonGuard }        from './shared/manage-season-guard.service';
import { SeasonCreateComponent }    from './season-create/season-create.component';
import { SeasonEditComponent }      from './season-edit/season-edit.component';
import { SeasonTableComponent }     from './season-table/season-table.component';

const routes: Routes = [
    {
        path: 'seasons',
        component: ManageSeasonComponent,
        canActivate: [ ManageSeasonGuard ],
        children: [
            {
                path: '',
                canActivateChild: [ ManageSeasonGuard ],
                children: [
                    { path: 'page/:number', component: SeasonTableComponent },
                    { path: 'create', component: SeasonCreateComponent },
                    { path: ':id/edit', component: SeasonEditComponent },
                    { path: '', component: SeasonTableComponent }
                ]
            }
        ]
    }
];

@NgModule({
    imports: [ RouterModule.forChild(routes) ],
    exports: [ RouterModule ]
})

export class ManageSeasonRoutingModule {}