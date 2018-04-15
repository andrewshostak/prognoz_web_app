import { Component, OnInit }    from '@angular/core';
import './rxjs-operators';

import { CurrentStateService }  from './core/current-state.service';
import { NotificationsService } from 'angular2-notifications';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

    constructor(
        private currentStateService: CurrentStateService,
        private notificationService: NotificationsService
    ) {}

    ngOnInit() {
        this.currentStateService.initialize();
        this.notificationService.globalOptions = {
            position: ['right', 'bottom'],
            timeOut: 5000,
            showProgressBar: false,
            maxLength: 0,
            animate: 'scale'
        };
    }
}
