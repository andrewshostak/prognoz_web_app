import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { NewsNewService } from '@services/new/news-new.service';
import { News } from '@models/v2/news.model';

@Component({
   selector: 'app-news-edit',
   templateUrl: './news-edit.component.html',
   styleUrls: ['./news-edit.component.scss']
})
export class NewsEditComponent implements OnInit {
   constructor(private activatedRoute: ActivatedRoute, private newsService: NewsNewService) {}

   news: News;

   ngOnInit() {
      this.activatedRoute.params.forEach((params: Params) => {
         this.getNewsItemData(params.id);
      });
   }

   private getNewsItemData(newsId: number): void {
      this.newsService.getNewsItem(newsId).subscribe(response => (this.news = response));
   }
}
