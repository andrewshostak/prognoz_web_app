import { Component } from '@angular/core';

import { NavigationItem } from '@models/navigation-item.model';

@Component({
    selector: 'app-team',
    templateUrl: './team.component.html',
    styleUrls: ['./team.component.scss']
})
export class TeamComponent {
    navigationItems: NavigationItem[] = [
        { link: ['/team', 'rules'], title: 'Правила' },
        { link: ['/team', 'squads'], title: 'Заявки / Склади' },
        { link: ['/team', 'matches'], title: 'Матчі' },
        { link: ['/team', 'predictions'], title: 'Прогнози' },
        { link: ['/team', 'rating'], title: 'Рейтинг' },
        { link: ['/team', 'results'], title: 'Результати' },
        { link: ['/team', 'my'], title: 'Моя команда' }
    ];
}
