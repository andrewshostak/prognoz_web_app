import { Component, OnInit } from '@angular/core';

import { Sequence } from '@enums/sequence.enum';
import { SeasonNew } from '@models/new/season-new.model';
import { SeasonSearch } from '@models/search/season-search.model';
import { SeasonNewService } from '@services/new/season-new.service';
import { SettingsService } from '@services/settings.service';
import { TitleService } from '@services/title.service';

@Component({
   selector: 'app-championship-seasons',
   templateUrl: './championship-seasons.component.html',
   styleUrls: ['./championship-seasons.component.scss']
})
export class ChampionshipSeasonsComponent implements OnInit {
   public seasons: SeasonNew[];

   constructor(private seasonService: SeasonNewService, private titleService: TitleService) {}

   public ngOnInit() {
      this.titleService.setTitle('Архів конкурсів - Чемпіонат');
      const search: SeasonSearch = {
         orderBy: 'id',
         sequence: Sequence.Descending,
         page: 1,
         limit: SettingsService.maxLimitValues.seasons
      };
      this.seasonService.getSeasons(search).subscribe(response => (this.seasons = response.data));
   }
}
