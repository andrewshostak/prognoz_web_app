import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { User } from '@models/v2/user.model';
import { CurrentStateService } from '@services/current-state.service';
import { AuthNewService } from '@services/new/auth-new.service';
import { HeaderImageService } from '@services/new/header-image.service';
import { NotificationsService } from 'angular2-notifications';
import { filter } from 'rxjs/operators';

@Component({
   selector: 'app-header',
   templateUrl: './header.component.html',
   styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements AfterViewInit, OnInit {
   public user: User;
   public navigationItems: { label: string; link: string }[] = [
      { label: 'Чемпіонат', link: '/championship' },
      { label: 'Командний', link: '/team' },
      { label: 'Кубок', link: '/cup' },
      { label: 'Гостьова', link: '/guestbook' }
   ];

   @ViewChild('logoBackground', { static: true }) public logoBackground: ElementRef;

   constructor(
      private authService: AuthNewService,
      private currentStateService: CurrentStateService,
      private headerImageService: HeaderImageService,
      private notificationsService: NotificationsService,
      private renderer: Renderer2,
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

   public ngAfterViewInit() {
      this.renderer.setStyle(this.logoBackground.nativeElement, 'background-image', this.headerImageService.getBackgroundImageValue());
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
