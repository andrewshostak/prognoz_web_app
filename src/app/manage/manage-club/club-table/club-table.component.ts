import { Component, OnInit }              from '@angular/core';
import { ActivatedRoute, Params }         from '@angular/router';

import { Club }                           from '../../../shared/models/club.model';
import { ClubService }                    from '../shared/club.service';
import { environment }                    from '../../../../environments/environment';
import { NotificationsService }           from 'angular2-notifications';

declare var $: any;

@Component({
  selector: 'app-club-table',
  templateUrl: './club-table.component.html',
  styleUrls: ['./club-table.component.css']
})
export class ClubTableComponent implements OnInit {

    constructor(
        private activatedRoute: ActivatedRoute,
        private clubService: ClubService,
        private notificationService: NotificationsService
    ) { }

    confirmModalData: any;
    confirmModalId: string;
    confirmModalMessage: string;
    confirmSpinnerButton: boolean;
    clubs: Club[];
    clubsImagesUrl: string = environment.apiImageClubs;
    currentPage: number;
    errorClubs: string | Array<string>;
    lastPage: number;
    path: string = '/manage/clubs/page/';
    perPage: number;
    total: number;

    confirmModalSubmit(data) {
        switch (this.confirmModalId) {
            case 'deleteClubConfirmModal':
                this.deleteClub(data);
                break;
        }
    }

    deleteClub(club) {
        this.confirmSpinnerButton = true;
        this.clubService.deleteClub(club.id)
            .subscribe(
                response => {
                    this.total--;
                    this.clubs = this.clubs.filter(n => n !== club);
                    this.notificationService.success('Успішно', club.title + ' видалено');
                    this.confirmSpinnerButton = false;
                    $('#' + this.confirmModalId).modal('hide');
                },
                errors => {
                    for (let error of errors) {
                        this.notificationService.error('Помилка', error);
                    }
                    this.confirmSpinnerButton = false;
                    $('#' + this.confirmModalId).modal('hide');
                });
    }

    deleteClubConfirmModalOpen(club: Club) {
        this.confirmModalMessage = 'Ви справді хочете видалити цей клуб?';
        this.confirmModalId = 'deleteClubConfirmModal';
        this.confirmModalData = club;
    }

    ngOnInit() {
        this.activatedRoute.params.subscribe((params: Params) => {
            let page = params['number'] ? params['number'] : 1;
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
}
