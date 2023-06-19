import { Component, OnInit } from '@angular/core';

import { Sequence } from '@enums/sequence.enum';
import { Season } from '@models/v2/season.model';
import { SeasonSearch } from '@models/search/season-search.model';
import { SeasonService } from '@services/v2/season.service';
import { SettingsService } from '@services/settings.service';
import { TitleService } from '@services/title.service';

@Component({
   selector: 'app-championship-seasons',
   templateUrl: './championship-seasons.component.html',
   styleUrls: ['./championship-seasons.component.scss']
})
export class ChampionshipSeasonsComponent implements OnInit {
   public seasons: Season[];

   constructor(private seasonService: SeasonService, private titleService: TitleService) {}

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
