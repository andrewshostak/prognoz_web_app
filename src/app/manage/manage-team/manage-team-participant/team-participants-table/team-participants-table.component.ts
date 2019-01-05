import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { environment } from '@env';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NotificationsService } from 'angular2-notifications';
import { Subscription } from 'rxjs';
import { TeamParticipant } from '@models/team/team-participant.model';
import { TeamParticipantService } from '@services/team/team-participant.service';
import { RequestParams } from '@models/request-params.model';

@Component({
    selector: 'app-team-participants-table',
    templateUrl: './team-participants-table.component.html',
    styleUrls: ['./team-participants-table.component.scss']
})
export class TeamParticipantsTableComponent implements OnDestroy, OnInit {
    constructor(
        private activatedRoute: ActivatedRoute,
        private ngbModalService: NgbModal,
        private notificationsService: NotificationsService,
        private teamParticipantService: TeamParticipantService
    ) {}

    activatedRouteSubscription: Subscription;
    confirmModalMessage: string;
    confirmModalSubmit: (event) => void;
    currentPage: string;
    errorTeamParticipants: string;
    lastPage: string;
    openedModalReference: NgbModalRef;
    path: string;
    perPage: string;
    teamParticipants: TeamParticipant[];
    total: number;
    userImageDefault: string;
    userImagesUrl: string;

    deleteTeamParticipant(teamParticipant: TeamParticipant): void {
        this.teamParticipantService.deleteTeamParticipant(teamParticipant.id).subscribe(
            () => {
                this.openedModalReference.close();
                this.total--;
                this.teamParticipants = this.teamParticipants.filter(participant => participant.id !== teamParticipant.id);
                this.notificationsService.success('Успішно', `Заявку / Учасника ${teamParticipant.id} видалено`);
            },
            errors => {
                this.openedModalReference.close();
                errors.for(error => this.notificationsService.error('Помилка', error));
            }
        );
    }

    ngOnDestroy() {
        if (!this.activatedRouteSubscription.closed) {
            this.activatedRouteSubscription.unsubscribe();
        }
    }

    ngOnInit() {
        this.path = '/manage/team/participants/page/';
        this.userImagesUrl = environment.apiImageUsers;
        this.userImageDefault = environment.imageUserDefault;
        this.activatedRouteSubscription = this.activatedRoute.params.subscribe((params: Params) => {
            const requestParams: RequestParams[] = [{ parameter: 'page', value: params['number'] }];
            this.teamParticipantService.getTeamParticipants(requestParams).subscribe(
                response => {
                    this.currentPage = response.current_page;
                    this.lastPage = response.last_page;
                    this.perPage = response.per_page;
                    this.total = response.total;
                    this.teamParticipants = response.data;
                },
                error => {
                    this.errorTeamParticipants = error;
                }
            );
        });
    }

    openConfirmModal(content: NgbModalRef, teamParticipant: TeamParticipant): void {
        this.confirmModalMessage = `Видалити заявку ${teamParticipant.user.name}?`;
        this.confirmModalSubmit = () => this.deleteTeamParticipant(teamParticipant);
        this.openedModalReference = this.ngbModalService.open(content);
    }
}
