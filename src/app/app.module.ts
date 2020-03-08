import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from '@app/app-routing.module';
import { AppComponent } from '@app/app.component';
import { AuthModule } from '@app/auth/auth.module';
import { ChampionshipModule } from '@app/championship/championship.module';
import { CoreModule } from '@app/core/core.module';
import { AuthInterceptor } from '@app/core/interceptors/auth.interceptor';
import { ErrorInterceptor } from '@app/core/interceptors/error.interceptor';
import { HomeModule } from '@app/home/home.module';
import { InitService } from '@app/init.service';
import { NewsModule } from '@app/news/news.module';
import { SharedModule } from '@app/shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { NgProgressModule } from 'ngx-progressbar';
import { NgProgressHttpModule } from 'ngx-progressbar/http';
import { QuillModule } from 'ngx-quill';

@NgModule({
   bootstrap: [AppComponent],
   declarations: [AppComponent],
   imports: [
      AppRoutingModule,
      AuthModule,
      BrowserAnimationsModule,
      BrowserModule,
      ChampionshipModule,
      CoreModule,
      HomeModule,
      HttpClientModule,
      NgbModule,
      NgProgressModule,
      NewsModule,
      NgProgressModule,
      NgProgressHttpModule,
      SimpleNotificationsModule.forRoot(),
      QuillModule.forRoot(),
      SharedModule
   ],
   providers: [
      Title,
      InitService,
      {
         multi: true,
         provide: HTTP_INTERCEPTORS,
         useClass: ErrorInterceptor
      },
      {
         multi: true,
         provide: HTTP_INTERCEPTORS,
         useClass: AuthInterceptor
      },
      {
         multi: true,
         provide: APP_INITIALIZER,
         useFactory: (initService: InitService) => () => initService.initializeUser(),
         deps: [InitService]
      }
   ]
})
export class AppModule {}
