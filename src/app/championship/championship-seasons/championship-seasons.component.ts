import { Component, OnInit }   from '@angular/core';

import { Season }              from '../../shared/models/season.model';
import { SeasonService }       from '../../core/season.service';
import { TitleService }        from '../../core/title.service';

@Component({
  selector: 'app-championship-seasons',
  templateUrl: './championship-seasons.component.html',
  styleUrls: ['./championship-seasons.component.css']
})
export class ChampionshipSeasonsComponent implements OnInit {

    constructor(
        private seasonService: SeasonService,
        private titleService: TitleService
    ) { }

    errorSeasons: string | Array<string>;
    seasons: Season[];

    ngOnInit() {
        this.titleService.setTitle('Архів конкурсів - Чемпіонат');
        this.seasonService.getSeasons().subscribe(
            response => {
                if (response) {
                    this.seasons = response.seasons;
                }
            },
            error => {
                this.errorSeasons = error;
            }
        );
    }
}
