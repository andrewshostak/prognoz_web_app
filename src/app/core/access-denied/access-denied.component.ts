import { Component, OnInit } from '@angular/core';

import { TitleService } from '@services/title.service';

@Component({
    selector: 'app-access-denied',
    templateUrl: './access-denied.component.html',
    styleUrls: ['./access-denied.component.scss']
})
export class AccessDeniedComponent implements OnInit {
    error = 'Помилка 403. Доступ заборонено. У вас нема прав для перегляду цієї сторінки.';

    constructor(private titleService: TitleService) {}

    ngOnInit() {
        this.titleService.setTitle('Помилка 403 - доступ заборонено');
    }
}
