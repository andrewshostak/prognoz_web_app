import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-manage',
    templateUrl: './manage.component.html',
    styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {
    navigationItems: { title: string; iconClass: string; routerLink: string }[];

    ngOnInit() {
        this.navigationItems = [
            { title: 'Чемпіонат', iconClass: 'fa-trophy', routerLink: 'championship' },
            { title: 'Командний', iconClass: 'fa-users', routerLink: 'team' },
            { title: 'Новини', iconClass: 'fa-newspaper-o', routerLink: 'news' },
            { title: 'Команди', iconClass: 'fa-shield', routerLink: 'clubs' },
            { title: 'Сезони', iconClass: 'fa-globe', routerLink: 'seasons' },
            { title: 'Змагання', iconClass: 'fa-star', routerLink: 'competitions' },
            { title: 'Кубок', iconClass: 'fa-futbol-o', routerLink: 'cup' }
        ];
    }
}
