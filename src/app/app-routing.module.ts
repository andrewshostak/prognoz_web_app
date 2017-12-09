import { NgModule }                 from '@angular/core';
import { RouterModule, Routes }     from '@angular/router';

import { AccessDeniedComponent }    from './core/access-denied/access-denied.component';
import { HomeComponent }            from './home/home.component';

const routes: Routes = [
    { path: '403', component: AccessDeniedComponent },
    { path: 'me', loadChildren: 'app/me/me.module#MeModule'},
    { path: 'user', redirectTo: '/me', pathMatch: 'full'},
    { path: '', component: HomeComponent}
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})

export class AppRoutingModule {}