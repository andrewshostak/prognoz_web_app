import { Component, OnInit } from '@angular/core';

@Component({
   selector: 'app-manage',
   styleUrls: ['./manage.component.scss'],
   templateUrl: './manage.component.html'
})
export class ManageComponent implements OnInit {
   public navigationItems: { title: string; iconClass: string; routerLink: string }[];

   public ngOnInit(): void {
      this.navigationItems = [
         { title: 'Матчі', iconClass: 'fa-futbol-o', routerLink: 'matches' },
         { title: 'Чемпіонат', iconClass: 'fa-trophy', routerLink: 'championship' },
         { title: 'Командний', iconClass: 'fa-users', routerLink: 'team' },
         { title: 'Кубок', iconClass: 'fa-user-circle-o', routerLink: 'cup' },
         { title: 'Новини', iconClass: 'fa-newspaper-o', routerLink: 'news' },
         { title: 'Змагання', iconClass: 'fa-star', routerLink: 'competitions' },
         { title: 'Клуби/Збірні', iconClass: 'fa-shield', routerLink: 'clubs' }
      ];
   }
}
