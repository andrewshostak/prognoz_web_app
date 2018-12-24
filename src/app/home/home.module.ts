import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from '../app-routing.module';
import { HomeComponent } from './home.component';
import { SharedModule } from '../shared/shared.module';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    imports: [CommonModule, AppRoutingModule, SharedModule, NgbCarouselModule],
    declarations: [HomeComponent]
})
export class HomeModule {}
