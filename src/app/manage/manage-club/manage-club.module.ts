import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '@app/shared/shared.module';
import { ClubCreateComponent } from './club-create/club-create.component';
import { ClubEditComponent } from './club-edit/club-edit.component';
import { ClubTableComponent } from './club-table/club-table.component';
import { ManageClubRoutingModule } from './manage-club-routing.module';
import { ManageClubComponent } from './manage-club.component';
import { ClubFormComponent } from './shared/club-form/club-form.component';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
   imports: [CommonModule, ReactiveFormsModule, ManageClubRoutingModule, SharedModule, NgbTooltipModule],
   declarations: [ManageClubComponent, ClubTableComponent, ClubCreateComponent, ClubEditComponent, ClubFormComponent]
})
export class ManageClubModule {}
