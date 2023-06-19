import { Component, OnInit } from '@angular/core';
import { Club } from '@models/v2/club.model';
import { ActivatedRoute, Params } from '@angular/router';
import { ClubService } from '@services/v2/club.service';

@Component({
   selector: 'app-club-edit',
   templateUrl: './club-edit.component.html',
   styleUrls: ['./club-edit.component.scss']
})
export class ClubEditComponent implements OnInit {
   public club: Club;

   constructor(private activatedRoute: ActivatedRoute, private clubService: ClubService) {}

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
