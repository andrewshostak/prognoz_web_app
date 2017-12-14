import { Component, OnInit } from '@angular/core';

import { Season }            from '../../../shared/models/season.model';
import { SeasonService }     from '../../../core/season.service';

@Component({
  selector: 'app-season-table',
  templateUrl: './season-table.component.html',
  styleUrls: ['./season-table.component.css']
})
export class SeasonTableComponent implements OnInit {

    constructor(
        private seasonService: SeasonService
    ) { }

    errorSeasons: string | Array<string>;
    seasons: Season[];

    ngOnInit() {
        this.seasonService.getSeasons().subscribe(
            response => {
                if (response) {
                    this.seasons = response.seasons;
                }
            },
            error => {
                this.errorSeasons = error;
            }
        );
    }

}
