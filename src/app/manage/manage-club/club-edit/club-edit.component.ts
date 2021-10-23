import { Component, OnInit } from '@angular/core';
import { ClubNew } from '@models/new/club-new.model';
import { ActivatedRoute, Params } from '@angular/router';
import { ClubNewService } from '@services/new/club-new.service';

@Component({
   selector: 'app-club-edit',
   templateUrl: './club-edit.component.html',
   styleUrls: ['./club-edit.component.scss']
})
export class ClubEditComponent implements OnInit {
   public club: ClubNew;

   constructor(private activatedRoute: ActivatedRoute, private clubService: ClubNewService) {}

   public ngOnInit(): void {
      this.activatedRoute.params.forEach((params: Params) => {
         this.getClubData(params.id);
      });
   }

   public successfullySubmitted(club: ClubNew): void {
      this.club = club;
   }

   private getClubData(id: number): void {
      this.clubService.getClub(id, ['parent']).subscribe(response => {
         this.club = response;
      });
   }
}
