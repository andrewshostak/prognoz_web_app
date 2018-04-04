import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-team-navigation',
  templateUrl: './team-navigation.component.html',
  styleUrls: ['./team-navigation.component.css']
})
export class TeamNavigationComponent implements OnInit {

    constructor() { }

    navigationItems: {link: string, title: string}[];

    ngOnInit() {
        this.navigationItems = [
            {link: '/team/rules', title: 'Правила'},
            {link: '/team/squads', title: 'Заявки / Склади'},
            {link: '/team/matches', title: 'Матчі'},
            {link: '/team/predictions', title: 'Прогнози'},
            {link: '/team/rating', title: 'Рейтинг'},
            {link: '/team/results', title: 'Результати'},
            {link: '/team/my', title: 'Моя команда'}
        ];
    }

}
