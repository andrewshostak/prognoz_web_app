import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthModule } from './auth/auth.module';
import { ChampionshipModule } from './championship/championship.module';
import { CoreModule } from './core/core.module';
import { HomeModule } from './home/home.module';
import { NewsModule } from './news/news.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgProgressModule, NgProgressInterceptor } from 'ngx-progressbar';
import { SharedModule } from './shared/shared.module';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { TeamModule } from './team/team.module';

@NgModule({
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
        NgbModule.forRoot(),
        NgProgressModule,
        TeamModule,
        NewsModule,
        SimpleNotificationsModule.forRoot(),
        SharedModule
    ],
    bootstrap: [AppComponent],
    providers: [Title, { provide: HTTP_INTERCEPTORS, useClass: NgProgressInterceptor, multi: true }]
})
export class AppModule {}
