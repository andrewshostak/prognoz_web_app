import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

import { ModelStatus } from '@enums/model-status.enum';
import { Sequence } from '@enums/sequence.enum';
import { Match } from '@models/match.model';
import { MatchSearch } from '@models/search/match-search.model';
import { MatchService } from '@services/new/match.service';
import { SettingsService } from '@services/settings.service';
import { UtilsService } from '@services/utils.service';

@Component({
   selector: 'app-match-select',
   styleUrls: ['./match-select.component.scss'],
   templateUrl: './match-select.component.html'
})
export class MatchSelectComponent implements OnChanges, OnInit {
   @Input() public fGroup: FormGroup;
   @Input() public match: Match;

   public clubsLogosPath: string;
   public matches: Match[];

   constructor(private matchService: MatchService) {}

   public getMatches(): void {
      const matchSearch: MatchSearch = {
         ended: ModelStatus.Falsy,
         limit: SettingsService.maxLimitValues.matches,
         orderBy: 'started_at',
         page: 1,
         sequence: Sequence.Descending
      };
      this.matchService.getMatches(matchSearch).subscribe(response => {
         this.matches = this.match ? response.data.concat([this.match]) : response.data;
      });
   }

   public ngOnChanges(changes: SimpleChanges): void {
      if (!changes.match.firstChange && changes.match.currentValue) {
         this.matches = this.matches ? [changes.match.currentValue].concat(this.matches) : [changes.match.currentValue];
      }
   }

   public ngOnInit(): void {
      this.clubsLogosPath = SettingsService.clubsLogosPath + '/';
      this.getMatches();
   }

   public matchesFilter(term: string, match: Match): boolean {
      const title = term.toLocaleLowerCase();
      return match.club_home.title.toLocaleLowerCase().indexOf(title) > -1 || match.club_away.title.toLocaleLowerCase().indexOf(title) > -1;
   }

   public showFormErrorMessage(abstractControl: AbstractControl, errorKey: string): boolean {
      return UtilsService.showFormErrorMessage(abstractControl, errorKey);
   }

   public showFormInvalidClass(abstractControl: AbstractControl): boolean {
      return UtilsService.showFormInvalidClass(abstractControl);
   }
}
