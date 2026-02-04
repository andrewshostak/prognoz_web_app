import { Component, OnInit } from '@angular/core';

import { ModelStatus } from '@enums/model-status.enum';
import { MatchState } from '@enums/match-state.enum';
import { Sequence } from '@enums/sequence.enum';
import { ChampionshipMatch } from '@models/v2/championship/championship-match.model';
import { ChampionshipMatchSearch } from '@models/search/championship/championship-match-search.model';
import { ChampionshipMatchService } from '@services/api/v2/championship/championship-match.service';
import { SettingsService } from '@services/settings.service';
import { PaginationService } from '@services/pagination.service';
import { TitleService } from '@services/title.service';
import { NewsService } from '@services/api/v2/news.service';
import { News } from '@models/v2/news.model';
import { NewsSearch } from '@models/search/news-search.model';

@Component({
   selector: 'app-home',
   styleUrls: ['./home.component.scss'],
   templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
   public championshipMatches: ChampionshipMatch[];
   public clubsLogosPath: string;
   public errorChampionshipMatches: string;
   public news: News[];
   public newsImagesUrl = SettingsService.imageBaseUrl.news;

   constructor(
      private championshipMatchService: ChampionshipMatchService,
      private newsService: NewsService,
      private titleService: TitleService
   ) {}

   public ngOnInit(): void {
      this.titleService.setTitle('Prognoz.org.ua - конкурси футбольних прогнозів, прогнози на топ-матчі, чемпіонати прогнозистів');
      this.clubsLogosPath = SettingsService.imageBaseUrl.clubs;
      this.getNewsData();
      this.getMatchesData();
   }

   private getMatchesData() {
      const search: ChampionshipMatchSearch = {
         limit: PaginationService.limit.championshipMatches,
         orderBy: 'started_at',
         page: 1,
         sequence: Sequence.Ascending,
         soon: ModelStatus.Truthy,
         states: [MatchState.Active]
      };

      this.championshipMatchService.getChampionshipMatches(search).subscribe(
         response => {
            const now = new Date();
            this.championshipMatches = response.data.filter(item => {
               const val = (item as any)?.match?.started_at;
               if (!val) return false;
               const start = new Date(val.replace(' ', 'T'));
               return start > now;
            });
         },
         error => {
            this.errorChampionshipMatches = error;
         }
      );
   }

   private getNewsData() {
      const search: NewsSearch = {
         page: 1,
         limit: 3,
         orderBy: 'created_at',
         sequence: Sequence.Descending
      };
      this.newsService.getNews(search).subscribe(response => (this.news = response.data));
   }
}
