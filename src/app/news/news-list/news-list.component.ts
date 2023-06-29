import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { TitleService } from '@services/title.service';
import { NewsService } from '@services/v2/news.service';
import { News } from '@models/v2/news.model';
import { Pagination } from '@models/pagination.model';
import { PaginationService } from '@services/pagination.service';
import { NewsSearch } from '@models/search/news-search.model';
import { SettingsService } from '@services/settings.service';
import { Sequence } from '@enums/sequence.enum';

@Component({
   selector: 'app-news-list',
   templateUrl: './news-list.component.html',
   styleUrls: ['./news-list.component.scss']
})
export class NewsListComponent implements OnInit {
   constructor(private activatedRoute: ActivatedRoute, private newsService: NewsService, private titleService: TitleService) {}

   news: News[];
   paginationData: Pagination;
   newsImagesUrl = SettingsService.imageBaseUrl.news;
   path = '/news/page/';

   ngOnInit() {
      this.titleService.setTitle('Новини');
      this.activatedRoute.params.subscribe((params: Params) => {
         const search: NewsSearch = {
            page: params.number,
            limit: PaginationService.perPage.news,
            relations: ['tournament'],
            orderBy: 'created_at',
            sequence: Sequence.Descending
         };
         this.newsService.getNews(search).subscribe(response => {
            this.news = response.data;
            this.paginationData = PaginationService.getPaginationData<News>(response, this.path);
         });
      });
   }
}
