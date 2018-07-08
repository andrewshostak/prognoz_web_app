import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { Club } from '@models/club.model';
import { ClubService } from '@services/club.service';
import { ConfirmModalService } from '@services/confirm-modal.service';
import { environment } from '@env';
import { NotificationsService } from 'angular2-notifications';

@Component({
    selector: 'app-club-table',
    templateUrl: './club-table.component.html',
    styleUrls: ['./club-table.component.css']
})
export class ClubTableComponent implements OnInit {
    constructor(
        private activatedRoute: ActivatedRoute,
        private clubService: ClubService,
        private confirmModalService: ConfirmModalService,
        private notificationService: NotificationsService
    ) {}

    clubs: Club[];
    clubsImagesUrl: string = environment.apiImageClubs;
    currentPage: number;
    errorClubs: string | Array<string>;
    lastPage: number;
    path = '/manage/clubs/page/';
    perPage: number;
    total: number;

    deleteClub(club: Club): void {
        this.confirmModalService.show(() => {
            this.clubService.deleteClub(club.id).subscribe(
                response => {
                    this.confirmModalService.hide();
                    this.total--;
                    this.clubs = this.clubs.filter(n => n !== club);
                    this.notificationService.success('Успішно', club.title + ' видалено');
                },
                errors => {
                    this.confirmModalService.hide();
                    for (const error of errors) {
                        this.notificationService.error('Помилка', error);
                    }
                }
            );
        }, `Видалити ${club.title}?`);
    }

    ngOnInit() {
        this.activatedRoute.params.subscribe((params: Params) => {
            const page = params['number'] ? params['number'] : 1;
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
