import { Component, OnInit } from '@angular/core';
import { Club } from '@models/v2/club.model';
import { ActivatedRoute, Params } from '@angular/router';
import { ClubNewService } from '@services/v2/club-new.service';

@Component({
   selector: 'app-club-edit',
   templateUrl: './club-edit.component.html',
   styleUrls: ['./club-edit.component.scss']
})
export class ClubEditComponent implements OnInit {
   public club: Club;

   constructor(private activatedRoute: ActivatedRoute, private clubService: ClubNewService) {}

   public ngOnInit(): void {
      this.activatedRoute.params.forEach((params: Params) => {
         this.getClubData(params.id);
      });
   }

   public successfullySubmitted(club: Club): void {
      this.club = club;
   }

   private getClubData(id: number): void {
      this.clubService.getClub(id, ['parent']).subscribe(response => {
         this.club = response;
      });
   }
}
