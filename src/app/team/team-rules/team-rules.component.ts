import { Component, OnInit } from '@angular/core';

import { TitleService } from '@services/title.service';

@Component({
    selector: 'app-team-rules',
    templateUrl: './team-rules.component.html',
    styleUrls: ['./team-rules.component.css']
})
export class TeamRulesComponent implements OnInit {
    constructor(private titleService: TitleService) {}

    ngOnInit() {
        this.titleService.setTitle('Правила конкурсу - Командний');
    }
}
