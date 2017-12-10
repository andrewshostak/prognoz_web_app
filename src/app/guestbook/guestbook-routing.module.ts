import { NgModule }                 from '@angular/core';
import { RouterModule, Routes }     from '@angular/router';

import { GuestbookComponent }       from './guestbook.component';
import { GuestbookPageComponent }   from './guestbook-page/guestbook-page.component';

const routes: Routes = [
    {
        path: 'guestbook/page/1',
        redirectTo: '/guestbook',
        pathMatch: 'full'
    },
    {
        path: '',
        component: GuestbookComponent,
        children: [
            {
                path: '',
                component: GuestbookPageComponent
            },
            {
                path: 'page/:number',
                component: GuestbookPageComponent
            }
        ]
    }
];

@NgModule({
    imports: [ RouterModule.forChild(routes) ],
    exports: [ RouterModule ]
})

export class GuestbookRoutingModule {}
