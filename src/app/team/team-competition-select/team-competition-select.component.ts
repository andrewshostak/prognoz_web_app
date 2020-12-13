import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Sequence } from '@enums/sequence.enum';
import { environment } from '@env';
import { Competition } from '@models/competition.model';
import { SeasonNew } from '@models/new/season-new.model';
import { SeasonSearch } from '@models/search/season-search.model';
import { CompetitionService } from '@services/competition.service';
import { CurrentStateService } from '@services/current-state.service';
import { SeasonNewService } from '@services/new/season-new.service';
import { SettingsService } from '@services/settings.service';

@Component({
   selector: 'app-team-competition-select',
   templateUrl: './team-competition-select.component.html',
   styleUrls: ['./team-competition-select.component.scss']
})
export class TeamCompetitionSelectComponent implements OnInit {
   public archiveCompetitions: Competition[];
   public competitions: Competition[];
   public errorArchiveCompetitions: string;
   public errorCompetitions: string;
   public filterCardExpanded: boolean;
   public filterTeamCompetitionsForm: FormGroup;
   public seasons: SeasonNew[];

   constructor(
      private activatedRoute: ActivatedRoute,
      private competitionService: CompetitionService,
      private currentStateService: CurrentStateService,
      private router: Router,
      private seasonService: SeasonNewService
   ) {}

   public isSelected(competition: Competition): boolean {
      return this.getTeamCompetitionIdFromUrl() === competition.id;
   }

   public navigate(competition: Competition, type: 'main' | 'archive' = 'main'): void {
      const urlArray = this.getRouterUrlAsArray();
      urlArray[3] = competition.id.toString();
      urlArray[4] = urlArray[4] ? urlArray[4] : 'matches';

      if (type === 'main') {
         this.currentStateService.teamCompetitionId = competition.id;
      }

      this.router.navigate(urlArray);
   }

   public ngOnInit() {
      this.activatedRoute.params.subscribe(() => {
         if (this.getRouterUrlAsArray().includes('get-active')) {
            if (this.currentStateService.teamCompetitionId) {
               this.router.navigate(['/team', 'competitions', this.currentStateService.teamCompetitionId, 'matches']);
            }
         }
      });

      this.competitionService.getCompetitions(null, environment.tournaments.team.id, null, null, true, true).subscribe(
         response => {
            this.errorCompetitions = null;
            if (response && response.competitions && response.competitions.length) {
               this.competitions = response.competitions;
               if (this.getRouterUrlAsArray().includes('get-active') && !this.currentStateService.teamCompetitionId) {
                  this.router.navigate(['/team', 'competitions', response.competitions[0].id, 'matches']);
               }
            } else {
               this.getLastEndedTeamCompetitions(1);
            }
         },
         error => {
            this.competitions = null;
            this.errorCompetitions = error;
         }
      );

      this.filterTeamCompetitionsForm = new FormGroup({
         season_id: new FormControl(''),
         competition_id: new FormControl('')
      });

      this.filterTeamCompetitionsForm.get('season_id').valueChanges.subscribe(value => {
         this.archiveCompetitions = null;
         if (value) {
            this.getCompetitionsData();
         }
      });

      this.filterTeamCompetitionsForm.get('competition_id').valueChanges.subscribe(value => {
         if (value) {
            this.navigate(this.archiveCompetitions.find(competition => competition.id.toString() === value), 'archive');
         }
      });
   }

   public resetTeamCompetitionsFormFilters(): void {
      this.filterTeamCompetitionsForm.reset();
   }

   public toggleFilterCardVisibility(): void {
      this.filterCardExpanded = !this.filterCardExpanded;

      if (!this.seasons && this.filterCardExpanded) {
         this.getSeasonsData();
      }
   }

   private getCompetitionsData(): void {
      this.competitionService
         .getCompetitions(null, environment.tournaments.team.id, this.filterTeamCompetitionsForm.get('season_id').value)
         .subscribe(
            response => {
               this.errorArchiveCompetitions = null;
               if (response) {
                  this.archiveCompetitions = response.competitions;
               }
            },
            error => {
               this.competitions = null;
               this.errorArchiveCompetitions = error;
            }
         );
   }

   private getRouterUrlAsArray(): string[] {
      return this.router.url.split('/');
   }

   private getSeasonsData(): void {
      const search: SeasonSearch = {
         limit: SettingsService.maxLimitValues.seasons,
         page: 1,
         orderBy: 'id',
         sequence: Sequence.Descending
      };
      this.seasonService.getSeasons(search).subscribe(response => (this.seasons = response.data));
   }

   private getTeamCompetitionIdFromUrl(): number {
      return parseInt(this.getRouterUrlAsArray()[3], 10);
   }

   private getLastEndedTeamCompetitions(limit: number): void {
      this.competitionService.getCompetitions(null, environment.tournaments.team.id, null, null, null, null, true, 1).subscribe(
         response => {
            this.errorCompetitions = null;
            if (response && response.competitions && response.competitions.length) {
               this.competitions = response.competitions;
               if (this.getRouterUrlAsArray().includes('get-active') && !this.currentStateService.teamCompetitionId) {
                  this.router.navigate(['/team', 'competitions', response.competitions[0].id, 'matches']);
               }
            }
         },
         error => {
            this.competitions = null;
            this.errorCompetitions = error;
         }
      );
   }
}
