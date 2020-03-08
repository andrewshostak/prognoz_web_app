import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AccessDeniedComponent } from './core/access-denied/access-denied.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
   { path: '403', component: AccessDeniedComponent },
   { path: 'guestbook', loadChildren: () => import('app/guestbook/guestbook.module').then(m => m.GuestbookModule) },
   { path: 'manage', loadChildren: () => import('app/manage/manage.module').then(m => m.ManageModule) },
   { path: 'me', loadChildren: () => import('app/me/me.module').then(m => m.MeModule) },
   { path: 'cup', loadChildren: () => import('app/cup/cup.module').then(m => m.CupModule) },
   { path: 'team', loadChildren: () => import('app/team/team.module').then(m => m.TeamModule) },
   { path: '', component: HomeComponent }
];

@NgModule({
   imports: [RouterModule.forRoot(routes)],
   exports: [RouterModule]
})
export class AppRoutingModule {}
