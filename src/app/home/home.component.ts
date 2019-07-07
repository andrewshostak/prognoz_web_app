import { Component, OnInit } from '@angular/core';

import { NewsService } from '@app/news/shared/news.service';
import { ModelStatus } from '@enums/model-status.enum';
import { Sequence } from '@enums/sequence.enum';
import { environment } from '@env';
import { ChampionshipMatchNew } from '@models/new/championship-match-new.model';
import { News } from '@models/news.model';
import { ChampionshipMatchSearch } from '@models/search/championship-match-search.model';
import { ChampionshipMatchNewService } from '@services/new/championship-match-new.service';
import { SettingsService } from '@services/settings.service';
import { TitleService } from '@services/title.service';

@Component({
   selector: 'app-home',
   styleUrls: ['./home.component.scss'],
   templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
   public championshipMatches: ChampionshipMatchNew[];
   public clubsLogosPath: string;
   public errorChampionshipMatches: string;
   public errorNews: string;
   public news: News[];
   public newsImagesUrl: string = environment.apiImageNews;

   constructor(
      private championshipMatchService: ChampionshipMatchNewService,
      private newsService: NewsService,
      private titleService: TitleService
   ) {}

   public ngOnInit(): void {
      this.titleService.setTitle('Prognoz.org.ua - конкурси футбольних прогнозів, прогнози на топ-матчі, чемпіонати прогнозистів');
      this.clubsLogosPath = SettingsService.clubsLogosPath + '/';
      this.getNewsData();
      this.getMatchesData();
   }

   private getMatchesData() {
      const search: ChampionshipMatchSearch = {
         active: ModelStatus.Truthy,
         limit: SettingsService.maxLimitValues.championshipMatches,
         orderBy: 'started_at',
         page: 1,
         sequence: Sequence.Ascending,
         soon: ModelStatus.Truthy
      };

      this.championshipMatchService.getChampionshipMatches(search).subscribe(
         response => {
            this.championshipMatches = response.data;
         },
         error => {
            this.errorChampionshipMatches = error;
         }
      );
   }

   private getNewsData() {
      this.newsService.getNews().subscribe(
         response => {
            if (response) {
               this.news = response.data;
            }
         },
         error => {
            this.errorNews = error;
         }
      );
   }
}
