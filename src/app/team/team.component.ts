import { Component, OnInit } from '@angular/core';

import { NavigationItem } from '@models/navigation-item.model';

@Component({
   selector: 'app-team',
   templateUrl: './team.component.html',
   styleUrls: ['./team.component.scss']
})
export class TeamComponent implements OnInit {
   public navigationItems: NavigationItem[];

   public ngOnInit() {
      this.navigationItems = [
         { link: ['/team', 'rules'], title: 'Правила' },
         { link: ['/team', 'participants'], title: 'Заявки / Склади' },
         { link: ['/team', 'team-matches'], title: 'Матчі' },
         { link: ['/team', 'predictions'], title: 'Прогнози' },
         { link: ['/team', 'rating'], title: 'Рейтинг' },
         { link: ['/team', 'results'], title: 'Результати' },
         { link: ['/team', 'my'], title: 'Моя команда' }
      ];
   }
}
