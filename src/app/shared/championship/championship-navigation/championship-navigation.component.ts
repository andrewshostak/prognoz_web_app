import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-championship-navigation',
  templateUrl: './championship-navigation.component.html',
  styleUrls: ['./championship-navigation.component.css']
})
export class ChampionshipNavigationComponent implements OnInit {

    navigationItems: {link: string, title: string}[];

    ngOnInit() {
        this.navigationItems = [
            {link: '/championship/rules', title: 'Правила'},
            {link: '/championship/predictions', title: 'Прогнози'},
            {link: '/championship/rating', title: 'Рейтинг'},
            {link: '/championship/results', title: 'Результати'},
            {link: '/championship/seasons', title: 'Архів'}
        ];
    }

}
