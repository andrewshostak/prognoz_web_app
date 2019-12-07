import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';
import { MeRoutingModule } from './me-routing.module';
import { MeComponent } from './me.component';

@NgModule({
   imports: [CommonModule, MeRoutingModule, ReactiveFormsModule, SharedModule],
   declarations: [MeComponent]
})
export class MeModule {}
