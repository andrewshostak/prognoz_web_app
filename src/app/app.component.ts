import { Component, OnInit } from '@angular/core';
import './rxjs-operators';

import { CurrentStateService } from '@services/current-state.service';
import { Options } from 'angular2-notifications';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
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
            animate: 'scale'
        };
    }
}
