import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '@app/shared/shared.module';
import { QuillModule } from 'ngx-quill';
import { ManageNewsRoutingModule } from './manage-news-routing.module';
import { ManageNewsComponent } from './manage-news.component';
import { NewsCreateComponent } from './news-create/news-create.component';
import { NewsEditComponent } from './news-edit/news-edit.component';
import { NewsTableComponent } from './news-table/news-table.component';
import { NewsFormComponent } from './shared/news-form/news-form.component';

@NgModule({
   imports: [CommonModule, ReactiveFormsModule, ManageNewsRoutingModule, QuillModule, SharedModule],
   declarations: [ManageNewsComponent, NewsTableComponent, NewsCreateComponent, NewsEditComponent, NewsFormComponent]
})
export class ManageNewsModule {}
