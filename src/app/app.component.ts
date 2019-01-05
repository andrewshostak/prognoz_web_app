import { Component, OnInit } from '@angular/core';

import { CurrentStateService } from '@services/current-state.service';
import { NotificationAnimationType, Options } from 'angular2-notifications';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    constructor(private currentStateService: CurrentStateService) {}

    options: Options;

    ngOnInit() {
        this.currentStateService.initialize();
        this.options = {
            timeOut: 5000,
            showProgressBar: false,
            maxLength: 0,
            animate: NotificationAnimationType.Scale
        };
    }
}
