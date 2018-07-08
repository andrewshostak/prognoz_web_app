import { Component } from '@angular/core';

import { NavigationItem } from '@models/navigation-item.model';

@Component({
    selector: 'app-cup',
    templateUrl: './cup.component.html',
    styleUrls: ['./cup.component.css']
})
export class CupComponent {
    navigationItems: NavigationItem[] = [
        { link: ['/cup', 'rules'], title: 'Правила' },
        { link: ['/cup', 'applications'], title: 'Заявки / Учасники' },
        { link: ['/cup', 'cup-matches', { active: 1 }], title: 'Матчі' },
        { link: ['/cup', 'predictions'], title: 'Прогнози' },
        { link: ['/cup', 'rating'], title: 'Рейтинг' }
    ];
}
