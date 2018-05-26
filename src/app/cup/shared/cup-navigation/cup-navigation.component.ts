import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cup-navigation',
  templateUrl: './cup-navigation.component.html',
  styleUrls: ['./cup-navigation.component.css']
})
export class CupNavigationComponent implements OnInit {

    constructor() { }

    navigationItems: {link: any[], title: string, queryParams?: any}[];

    ngOnInit() {
        this.navigationItems = [
            {link: ['/cup/rating'], title: 'Рейтинг'},
            {link: ['/cup/applications'], title: 'Заявки / Учасники'},
            {link: ['/cup/cup-matches', {active: 1}], title: 'Матчі'},
            {link: ['/cup/predictions'], title: 'Прогнози'},
        ];
    }

}
