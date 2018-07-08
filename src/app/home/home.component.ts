import { Component, OnInit } from '@angular/core';

import { ChampionshipMatch } from '@models/championship/championship-match.model';
import { ChampionshipMatchService } from '@services/championship/championship-match.service';
import { environment } from '@env';
import { News } from '@models/news.model';
import { NewsService } from '../news/shared/news.service';
import { TitleService } from '@services/title.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    constructor(
        private championshipMatchService: ChampionshipMatchService,
        private newsService: NewsService,
        private titleService: TitleService
    ) {}

    championshipMatches: ChampionshipMatch[];
    clubsImagesUrl: string = environment.apiImageClubs;
    errorChampionshipMatches: string;
    errorNews: string | Array<string>;
    news: News[];
    newsImagesUrl: string = environment.apiImageNews;

    ngOnInit() {
        this.titleService.setTitle('Prognoz.org.ua - конкурси футбольних прогнозів, прогнози на топ-матчі, чемпіонати прогнозистів');
        this.getNewsData();
        this.getMatchesData();
    }

    private getMatchesData() {
        const param = [{ parameter: 'filter', value: 'predictable' }, { parameter: 'coming', value: 'true' }];
        this.championshipMatchService.getChampionshipMatches(param).subscribe(
            response => {
                if (response) {
                    this.championshipMatches = response.championship_matches;
                }
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
