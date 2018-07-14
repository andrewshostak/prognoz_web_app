import { Component, OnInit } from '@angular/core';

import { TitleService } from '@services/title.service';

@Component({
    selector: 'app-championship-rules',
    templateUrl: './championship-rules.component.html',
    styleUrls: ['./championship-rules.component.scss']
})
export class ChampionshipRulesComponent implements OnInit {
    constructor(private titleService: TitleService) {}

    exampleMatches = [
        { id: 1, home: 'Динамо', away: 'Спартак', predict: '1:0', result: '4:1', points: 1 },
        { id: 2, home: 'Боруссія Дортмунд', away: 'Ювентус', predict: '2:0', result: '3:1', points: 2 },
        { id: 3, home: 'Україна', away: 'Швейцарія', predict: '1:1', result: '0:0', points: 2 },
        { id: 4, home: 'Баварія', away: 'Манчестер Юнайтед', predict: '1:2', result: '1:2', points: 3 }
    ];

    ngOnInit() {
        this.titleService.setTitle('Правила конкурсу - Чемпіонат');
    }
}
