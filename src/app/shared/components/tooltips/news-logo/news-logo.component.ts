import { Component, Input } from '@angular/core';

import { SettingsService } from '@services/settings.service';
import { NewsNew } from '@models/new/news-new.model';

@Component({
   selector: 'app-news-logo',
   styleUrls: ['./news-logo.component.scss'],
   templateUrl: './news-logo.component.html'
})
export class NewsLogoComponent {
   @Input() public news: NewsNew;

   private newsLogosPath: string = SettingsService.newsLogosPath + '/';

   get src(): string {
      return this.newsLogosPath + this.news.image;
   }
}
