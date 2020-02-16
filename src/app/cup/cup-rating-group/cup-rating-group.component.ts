import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { CupRatingGroup } from '@models/cup/cup-rating-group.model';
import { CompetitionNew } from '@models/new/competition-new.model';
import { CupRatingService } from '@services/cup/cup-rating.service';
import { CompetitionNewService } from '@services/new/competition-new.service';
import { TitleService } from '@services/title.service';
import { UtilsService } from '@services/utils.service';
import { first, get, last } from 'lodash';

@Component({
   selector: 'app-cup-rating-group',
   styleUrls: ['./cup-rating-group.component.scss'],
   templateUrl: './cup-rating-group.component.html'
})
export class CupRatingGroupComponent implements OnInit {
   public cupRatingGroup: CupRatingGroup[];
   public getHomeCityInBrackets = UtilsService.getHomeCityInBrackets;
   public groupNumber: number;
   public groupNumbers: number[];

   private competition: CompetitionNew;
   private competitionId: number;

   constructor(
      private activatedRoute: ActivatedRoute,
      private competitionService: CompetitionNewService,
      private cupRatingService: CupRatingService,
      private router: Router,
      private titleService: TitleService
   ) {}

   public isFirstGroup(groupNumber: number): boolean {
      return first<number>(this.groupNumbers) === groupNumber;
   }

   public isLastGroup(groupNumber: number): boolean {
      return last<number>(this.groupNumbers) === groupNumber;
   }

   public navigateToGroup(groupNumber: number): void {
      this.router.navigate(['/cup', this.competitionId, 'rating-group', groupNumber]);
   }

   public nextGroup(): void {
      if (this.isLastGroup(this.groupNumber)) {
         return;
      }

      this.navigateToGroup(++this.groupNumber);
   }

   public ngOnInit() {
      this.activatedRoute.params.subscribe((params: Params) => {
         this.competitionId = parseInt(params.competitionId, 10);
         this.groupNumber = parseInt(params.groupNumber, 10);
         this.titleService.setTitle(`Рейтинг групи ${this.groupNumber} - Кубок`);

         if (!this.groupNumbers) {
            this.getCupRatingGroupsData(this.competitionId);
         }

         if (!this.competition) {
            this.getCompetitionData(this.competitionId);
         }

         this.getCupRatingGroupData(this.competitionId, this.groupNumber);
      });
   }

   public previousGroup(): void {
      if (this.isFirstGroup(this.groupNumber)) {
         return;
      }

      this.navigateToGroup(--this.groupNumber);
   }

   public showPositionHighlight(index: number, key: string): boolean {
      if (!this.competition) {
         return false;
      }
      const promotion: number[] = get(this.competition, key);
      if (!promotion) {
         return false;
      }

      return promotion.includes(index + 1);
   }

   private getCompetitionData(competitionId: number): void {
      this.competitionService.getCompetition(competitionId).subscribe(response => (this.competition = response));
   }

   private getCupRatingGroupData(competitionId: number, groupNumber: number): void {
      this.cupRatingService.getCupRatingGroup(competitionId, groupNumber).subscribe(response => (this.cupRatingGroup = response));
   }

   private getCupRatingGroupsData(competitionId: number): void {
      this.cupRatingService.getCupRatingGroups(competitionId).subscribe(response => (this.groupNumbers = response));
   }
}
