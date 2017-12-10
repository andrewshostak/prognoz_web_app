import { NgModule }                 from '@angular/core';
import { RouterModule, Routes }     from '@angular/router';

import { ManageComponent }          from './manage.component';
import { ManageGuard }              from './shared/manage-guard.service';

const routes: Routes = [
    {
        path: '',
        component: ManageComponent,
        canActivate: [ManageGuard]
    }
];

@NgModule({
    imports: [ RouterModule.forChild(routes) ],
    exports: [ RouterModule ]
})

export class ManageRoutingModule {}