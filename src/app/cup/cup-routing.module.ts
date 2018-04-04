import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CupComponent }         from './cup.component';
import { CupRatingComponent }   from './cup-rating/cup-rating.component';

const routes: Routes = [
    {
        path: '',
        component: CupComponent,
        children: [
            {
                path: 'rating',
                component: CupRatingComponent
            },
        ]
    }
];

@NgModule({
    imports: [ RouterModule.forChild(routes) ],
    exports: [ RouterModule ]
})

export class CupRoutingModule {}
