import { Component } from '@angular/core';

import { NavigationItem } from '@models/navigation-item.model';

@Component({
    selector: 'app-championship',
    templateUrl: './championship.component.html',
    styleUrls: ['./championship.component.css']
})
export class ChampionshipComponent {
    navigationItems: NavigationItem[] = [
        { link: ['/championship', 'rules'], title: 'Правила' },
        { link: ['/championship', 'predictions'], title: 'Прогнози' },
        { link: ['/championship', 'rating'], title: 'Рейтинг' },
        { link: ['/championship', 'results'], title: 'Результати' },
        { link: ['/championship', 'seasons'], title: 'Архів' }
    ];
}
