import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cup-navigation',
  templateUrl: './cup-navigation.component.html',
  styleUrls: ['./cup-navigation.component.css']
})
export class CupNavigationComponent implements OnInit {

    constructor() { }

    navigationItems: {link: string, title: string}[];

    ngOnInit() {
        this.navigationItems = [
            {link: '/cup/rating', title: 'Рейтинг'}
        ];
    }

}
