import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { NewsComponent } from './news.component';
import { NewsDetailComponent } from './news-detail/news-detail.component';
import { NewsListComponent } from './news-list/news-list.component';
import { NewsRoutingModule } from './news-routing.module';
import { SharedModule } from '../shared/shared.module';
import { CommentNewService } from '@app/news/shared/comment-new.service';
import { CommentFormComponent } from '@app/news/shared/comment-form/comment-form.component';

@NgModule({
   imports: [CommonModule, ReactiveFormsModule, NewsRoutingModule, SharedModule],
   declarations: [NewsComponent, NewsDetailComponent, NewsListComponent, CommentFormComponent],
   providers: [CommentNewService],
   exports: [NewsComponent]
})
export class NewsModule {}
