import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from '@app/app-routing.module';
import { AppComponent } from '@app/app.component';
import { AuthModule } from '@app/auth/auth.module';
import { ChampionshipModule } from '@app/championship/championship.module';
import { CoreModule } from '@app/core/core.module';
import { HomeModule } from '@app/home/home.module';
import { NewsModule } from '@app/news/news.module';
import { SharedModule } from '@app/shared/shared.module';
import { TeamModule } from '@app/team/team.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgProgressModule } from '@ngx-progressbar/core';
import { NgProgressHttpModule } from '@ngx-progressbar/http';
import { SimpleNotificationsModule } from 'angular2-notifications';

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
      TeamModule,
      NewsModule,
      NgProgressModule,
      NgProgressHttpModule,
      SimpleNotificationsModule.forRoot(),
      SharedModule
   ],
   providers: [Title]
})
export class AppModule {}
