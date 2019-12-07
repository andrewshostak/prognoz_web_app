import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '@app/core/guards/auth.guard.service';
import { MeComponent } from './me.component';

export const routes: Routes = [
   {
      path: '',
      pathMatch: 'full',
      component: MeComponent,
      canActivate: [AuthGuard]
   }
];

@NgModule({
   imports: [RouterModule.forChild(routes)],
   exports: [RouterModule]
})
export class MeRoutingModule {}
