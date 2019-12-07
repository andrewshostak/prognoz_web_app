import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RoleGuard } from '@app/manage/shared/role-guard.service';
import { ManageNewsComponent } from './manage-news.component';
import { NewsCreateComponent } from './news-create/news-create.component';
import { NewsEditComponent } from './news-edit/news-edit.component';
import { NewsTableComponent } from './news-table/news-table.component';

const routes: Routes = [
   {
      canActivate: [RoleGuard],
      canActivateChild: [RoleGuard],
      data: { roles: ['news_editor'] },
      path: 'news',
      component: ManageNewsComponent,
      children: [
         { path: 'page/:number', component: NewsTableComponent, data: { roles: ['news_editor'] } },
         { path: 'create', component: NewsCreateComponent, data: { roles: ['news_editor'] } },
         { path: ':id/edit', component: NewsEditComponent, data: { roles: ['news_editor'] } },
         { path: '', component: NewsTableComponent, data: { roles: ['news_editor'] } }
      ]
   }
];

@NgModule({
   imports: [RouterModule.forChild(routes)],
   exports: [RouterModule]
})
export class ManageNewsRoutingModule {}
