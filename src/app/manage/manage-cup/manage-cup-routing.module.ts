import { NgModule }                 from '@angular/core';
import { RouterModule, Routes }     from '@angular/router';

import { ManageCupComponent }       from './manage-cup.component';
import { ManageCupGuard }           from './shared/manage-cup-stage-guard.service';
import { ManageCupMatchComponent }  from './manage-cup-match/manage-cup-match.component';
import { ManageCupStageComponent }  from './manage-cup-stage/manage-cup-stage.component';
import { CupMatchEditComponent }    from './manage-cup-match/cup-match-edit/cup-match-edit.component';
import { CupMatchCreateComponent }  from './manage-cup-match/cup-match-create/cup-match-create.component';
import { CupMatchTableComponent }   from './manage-cup-match/cup-match-table/cup-match-table.component';
import { CupStagesTableComponent }  from './manage-cup-stage/cup-stages-table/cup-stages-table.component';
import { CupStageCreateComponent }  from './manage-cup-stage/cup-stage-create/cup-stage-create.component';
import { CupStageEditComponent }    from './manage-cup-stage/cup-stage-edit/cup-stage-edit.component';

const routes: Routes = [
    {
        path: 'cup',
        component: ManageCupComponent,
        canActivate: [ ManageCupGuard ],
        canActivateChild: [ ManageCupGuard ],
        children: [
            {
                path: 'stages',
                component: ManageCupStageComponent,
                children: [
                    { path: 'page/:number', component: CupStagesTableComponent },
                    { path: 'create', component: CupStageCreateComponent },
                    { path: ':id/edit', component: CupStageEditComponent },
                    { path: '', redirectTo: 'page/1', pathMatch: 'full' }
                ]
            },
            {
                path: 'matches',
                component: ManageCupMatchComponent,
                children: [
                    { path: 'page/:number', component: CupMatchTableComponent },
                    { path: 'create', component: CupMatchCreateComponent },
                    { path: ':id/edit', component: CupMatchEditComponent },
                    { path: '', redirectTo: 'page/1', pathMatch: 'full' }
                ]
            }
        ]
    }
];

@NgModule({
    imports: [ RouterModule.forChild(routes) ],
    exports: [ RouterModule ]
})

export class ManageCupRoutingModule {}
