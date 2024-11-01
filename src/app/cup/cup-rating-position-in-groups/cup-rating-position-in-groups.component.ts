import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CupRatingGroup } from '@models/v2/cup/cup-rating-group.model';
import { CupRatingService } from '@app/core/services/api/v2/cup/cup-rating.service';
import { PaginatedResponse } from '@models/paginated-response.model';
import { CupRatingPositionSearch } from '@app/shared/models/search/cup/cup-rating-position-search.model';

@Component({
   selector: 'app-cup-rating-position-in-groups',
   templateUrl: './cup-rating-position-in-groups.component.html',
   styleUrls: ['./cup-rating-position-in-groups.component.scss']
})
export class CupRatingPositionInGroupsComponent implements OnInit {
   public competitionId!: number;
   public position!: number;
   public ratingData!: CupRatingGroup;
   public furtheranceData!: number[];

   constructor(private route: ActivatedRoute, private cupRatingService: CupRatingService) {}

   ngOnInit(): void {
      this.route.paramMap.subscribe(params => {
         this.competitionId = Number(params.get('competitionId'));
         this.position = Number(params.get('position'));
         this.loadData();
      });
   }

   private loadData(): void {
      const searchParams: CupRatingPositionSearch = {
         competitionId: this.competitionId,
         position: this.position
      };
      this.cupRatingService.getCupRatingPositionInGroups(searchParams).subscribe(data => {
         this.ratingData = data;
      });
      this.cupRatingService.getCupGroupFurtheranceByPosition(searchParams).subscribe((response: PaginatedResponse<number>) => {
         this.furtheranceData = response.data;
      });
   }
}
