import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-manage-cup',
    templateUrl: './manage-cup.component.html',
    styleUrls: ['./manage-cup.component.scss']
})
export class ManageCupComponent implements OnInit {
    navigationItems: { title: string; routerLink: string }[];

    ngOnInit() {
        this.navigationItems = [
            { title: 'Стадії', routerLink: 'stages' },
            { title: 'Матчі', routerLink: 'matches' },
            { title: 'Кубок-матчі', routerLink: 'cup-matches' }
        ];
    }
}
