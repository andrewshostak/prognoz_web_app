import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ManageMatchComponent } from './manage-match.component';
import { MatchTableComponent } from './match-table/match-table.component';
import { ManageMatchGuard } from './shared/manage-match-guard.service';

const routes: Routes = [
    {
        path: 'matches',
        component: ManageMatchComponent,
        canActivate: [ManageMatchGuard],
        canActivateChild: [ManageMatchGuard],
        children: [{ path: '', component: MatchTableComponent }]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ManageMatchRoutingModule {}
