import { Component, Input } from '@angular/core';

import { SettingsService } from '@services/settings.service';
import { News } from '@models/v2/news.model';

@Component({
   selector: 'app-news-logo',
   styleUrls: ['./news-logo.component.scss'],
   templateUrl: './news-logo.component.html'
})
export class NewsLogoComponent {
   @Input() public news: News;

   private newsLogosPath: string = SettingsService.newsLogosPath + '/';

   get src(): string {
      return this.newsLogosPath + this.news.image;
   }
}
