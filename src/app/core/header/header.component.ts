import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { UserNew } from '@models/new/user-new.model';
import { CurrentStateService } from '@services/current-state.service';
import { AuthNewService } from '@services/new/auth-new.service';
import { NotificationsService } from 'angular2-notifications';
import { filter } from 'rxjs/operators';

@Component({
   selector: 'app-header',
   templateUrl: './header.component.html',
   styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
   public collapsed: boolean;
   public user: UserNew;

   constructor(
      private authService: AuthNewService,
      private currentStateService: CurrentStateService,
      private notificationsService: NotificationsService,
      private router: Router
   ) {}

   public logout(): void {
      this.authService.logout().subscribe(() => {});
      this.authService.setUser(null);
      this.user = null;
      localStorage.clear();
      this.currentStateService.getOnlineUsers(null);
      this.notificationsService.info('Успішно', 'Ви вийшли зі свого аккаунту');
      this.router.navigate(['/']);
   }

   public ngOnInit(): void {
      this.subscribeToNavigationChanges();
   }

   private subscribeToNavigationChanges(): void {
      this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
         this.user = this.authService.getUser();
      });
   }
}
