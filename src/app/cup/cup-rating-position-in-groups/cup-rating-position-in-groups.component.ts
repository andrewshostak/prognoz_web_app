import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CupRatingGroup } from '@models/v2/cup/cup-rating-group.model';
import { CupRatingService } from '@app/core/services/api/v2/cup/cup-rating.service';
import { PaginatedResponse } from '@models/paginated-response.model';
import { CupRatingPositionSearch } from '@app/shared/models/search/cup/cup-rating-position-search.model';
import { get } from 'lodash';

@Component({
   selector: 'app-cup-rating-position-in-groups',
   templateUrl: './cup-rating-position-in-groups.component.html',
   styleUrls: ['./cup-rating-position-in-groups.component.scss']
})
export class CupRatingPositionInGroupsComponent implements OnInit {
   public competitionId: number;
   public position: number;
   public ratingData: CupRatingGroup[];
   public positionsToPromote!: number[];
   public possiblePromotion: number[] = [];
   public ratingTitle: string = '';

   constructor(private activatedRoute: ActivatedRoute, private cupRatingService: CupRatingService) {}

   ngOnInit(): void {
      this.activatedRoute.params.forEach(params => {
         this.competitionId = Number(params.competitionId);
         this.position = Number(params.position);
         this.loadData();
      });
   }

   private loadData(): void {
      const searchParams: CupRatingPositionSearch = {
         competitionId: this.competitionId,
         position: this.position
      };
      this.cupRatingService.getCupRatingPositionInGroups(searchParams).subscribe(response => {
         this.ratingData = response.data;
         this.possiblePromotion = get(response, 'config.cup.group.possible_promotion', []);
         this.ratingTitle = `Рейтинг ${this.position} місць`;
      });
      this.cupRatingService.getCupGroupFurtheranceByPosition(searchParams).subscribe(response => {
         this.positionsToPromote = response.data;
      });
   }
}
