import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ManageNewsComponent } from './manage-news.component';
import { ManageNewsGuard } from './shared/manage-news-guard.service';
import { ManageNewsRoutingModule } from './manage-news-routing.module';
import { NewsCreateComponent } from './news-create/news-create.component';
import { NewsEditComponent } from './news-edit/news-edit.component';
import { NewsFormComponent } from './shared/news-form/news-form.component';
import { NewsTableComponent } from './news-table/news-table.component';
import { SharedModule } from '../../shared/shared.module';
import { QuillModule } from 'ngx-quill';

@NgModule({
    imports: [CommonModule, ReactiveFormsModule, ManageNewsRoutingModule, QuillModule, SharedModule],
    declarations: [ManageNewsComponent, NewsTableComponent, NewsCreateComponent, NewsEditComponent, NewsFormComponent],
    providers: [ManageNewsGuard]
})
export class ManageNewsModule {}
