import { NgModule }             from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MeComponent }          from './me.component';
import { MeGuard }              from './me-guard.service';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: MeComponent,
        canActivate: [MeGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MeRoutingModule { }