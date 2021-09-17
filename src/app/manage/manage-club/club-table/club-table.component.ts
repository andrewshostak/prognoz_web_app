import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { Club } from '@models/club.model';
import { ClubService } from '@services/club.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NotificationsService } from 'angular2-notifications';

@Component({
   selector: 'app-club-table',
   templateUrl: './club-table.component.html',
   styleUrls: ['./club-table.component.scss']
})
export class ClubTableComponent implements OnInit {
   constructor(
      private activatedRoute: ActivatedRoute,
      private clubService: ClubService,
      private ngbModalService: NgbModal,
      private notificationsService: NotificationsService
   ) {}

   clubs: Club[];
   confirmModalMessage: string;
   confirmModalReference: NgbModalRef;
   currentPage: number;
   errorClubs: string | string[];
   lastPage: number;
   path = '/manage/clubs/page/';
   perPage: number;
   selectedClub: Club;
   total: number;

   deleteClub(): void {
      this.clubService.deleteClub(this.selectedClub.id).subscribe(
         () => {
            this.confirmModalReference.close();
            this.total--;
            this.clubs = this.clubs.filter(n => n.id !== this.selectedClub.id);
            this.notificationsService.success('Успішно', this.selectedClub.title + ' видалено');
         },
         errors => {
            this.confirmModalReference.close();
            for (const error of errors) {
               this.notificationsService.error('Помилка', error);
            }
         }
      );
   }

   ngOnInit() {
      this.activatedRoute.params.subscribe((params: Params) => {
         const page = params.number ? params.number : 1;
         this.clubService.getClubs(page).subscribe(
            response => {
               if (response) {
                  this.currentPage = response.current_page;
                  this.lastPage = response.last_page;
                  this.perPage = response.per_page;
                  this.total = response.total;
                  this.clubs = response.data;
               }
            },
            error => {
               this.errorClubs = error;
            }
         );
      });
   }

   openConfirmModal(content: NgbModalRef, club: Club): void {
      this.confirmModalMessage = `Видалити ${club.title}?`;
      this.selectedClub = club;
      this.confirmModalReference = this.ngbModalService.open(content);
      this.confirmModalReference.result.then(
         () => (this.selectedClub = null),
         () => (this.selectedClub = null)
      );
   }
}
