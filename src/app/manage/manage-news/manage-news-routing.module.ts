import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PermissionGuard } from '@app/manage/shared/permission-guard.service';
import { ManageNewsComponent } from './manage-news.component';
import { NewsCreateComponent } from './news-create/news-create.component';
import { NewsEditComponent } from './news-edit/news-edit.component';
import { NewsTableComponent } from './news-table/news-table.component';

const routes: Routes = [
   {
      canActivate: [PermissionGuard],
      data: { permissions: ['create_news', 'update_news', 'delete_news'] },
      children: [
         { path: 'page/:number', component: NewsTableComponent },
         { path: 'create', component: NewsCreateComponent, canActivate: [PermissionGuard], data: { permissions: ['create_news'] } },
         { path: ':id/edit', component: NewsEditComponent, canActivate: [PermissionGuard], data: { permissions: ['update_news'] } },
         { path: '', component: NewsTableComponent }
      ],
      path: 'news',
      component: ManageNewsComponent
   }
];

@NgModule({
   imports: [RouterModule.forChild(routes)],
   exports: [RouterModule]
})
export class ManageNewsRoutingModule {}
