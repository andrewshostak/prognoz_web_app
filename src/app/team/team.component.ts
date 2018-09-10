import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { CurrentStateService } from '@services/current-state.service';
import { NavigationItem } from '@models/navigation-item.model';

@Component({
    selector: 'app-team',
    templateUrl: './team.component.html',
    styleUrls: ['./team.component.scss']
})
export class TeamComponent implements OnInit {
    constructor(private activatedRoute: ActivatedRoute, private currentStateService: CurrentStateService) {}

    navigationItems: NavigationItem[];

    ngOnInit() {
        this.navigationItems = [
            { link: ['/team', 'competitions', '', 'rules'], title: 'Правила' },
            { link: ['/team', 'competitions', '', 'squads'], title: 'Заявки / Склади' },
            { link: ['/team', 'competitions', '', 'matches'], title: 'Матчі' },
            { link: ['/team', 'competitions', '', 'predictions'], title: 'Прогнози' },
            { link: ['/team', 'competitions', '', 'rating'], title: 'Рейтинг' },
            { link: ['/team', 'competitions', '', 'results'], title: 'Результати' },
            { link: ['/team', 'competitions', '', 'my'], title: 'Моя команда' }
        ];

        if (this.activatedRoute.firstChild) {
            this.activatedRoute.firstChild.params.subscribe((params: Params) => {
                this.navigationItems = this.navigationItems.map(navigationItem => {
                    navigationItem.link[2] =
                        params['competitionId'] === 'get-active' && this.currentStateService.teamCompetitionId
                            ? this.currentStateService.teamCompetitionId
                            : params['competitionId'];

                    return navigationItem;
                });
            });
        }
    }
}
