import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { NavigationItem } from '@models/navigation-item.model';
import { CurrentStateService } from '@services/current-state.service';

@Component({
   selector: 'app-team',
   templateUrl: './team.component.html',
   styleUrls: ['./team.component.scss']
})
export class TeamComponent implements OnInit {
   public navigationItems: NavigationItem[];
   constructor(private activatedRoute: ActivatedRoute, private currentStateService: CurrentStateService) {}

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

      // todo: remove after moving to team-stages. search 'get-active' in other places
      if (this.activatedRoute.firstChild) {
         this.activatedRoute.firstChild.params.subscribe((params: Params) => {
            this.navigationItems = this.navigationItems.map(navigationItem => {
               if (navigationItem.link[1] !== 'competitions') {
                  return navigationItem;
               }
               navigationItem.link[2] =
                  params.competitionId === 'get-active' && this.currentStateService.teamCompetitionId
                     ? this.currentStateService.teamCompetitionId
                     : params.competitionId;

               return navigationItem;
            });
         });
      }
   }
}
