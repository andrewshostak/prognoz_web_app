import { Component, OnInit } from '@angular/core';

import { TitleService } from '@services/title.service';

@Component({
    selector: 'app-page-not-found',
    templateUrl: './page-not-found.component.html',
    styleUrls: ['./page-not-found.component.css']
})
export class PageNotFoundComponent implements OnInit {
    error = 'Помилка 404. Такої сторінки не існує. Перевірте правильність введеної адреси.';

    constructor(private titleService: TitleService) {}

    ngOnInit() {
        this.titleService.setTitle('Помилка 404 - сторінки не існує');
    }
}
