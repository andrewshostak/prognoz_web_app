import { Component, OnInit }    from '@angular/core';
import { TitleService }         from '../../core/title.service';

@Component({
  selector: 'app-cup-rules',
  templateUrl: './cup-rules.component.html',
  styleUrls: ['./cup-rules.component.css']
})
export class CupRulesComponent implements OnInit {

    constructor(
        private titleService: TitleService
    ) { }

    ngOnInit() {
        this.titleService.setTitle('Правила конкурсу - Кубок');
    }

}
