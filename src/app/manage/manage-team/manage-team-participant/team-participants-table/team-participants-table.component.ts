import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { ConfirmModalService } from '@services/confirm-modal.service';
import { environment } from '@env';
import { NotificationsService } from 'angular2-notifications';
import { Subscription } from 'rxjs/Subscription';
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
        private confirmModalService: ConfirmModalService,
        private notificationsService: NotificationsService,
        private teamParticipantService: TeamParticipantService
    ) {}

    activatedRouteSubscription: Subscription;
    currentPage: string;
    errorTeamParticipants: string;
    lastPage: string;
    path: string;
    perPage: string;
    teamParticipants: TeamParticipant[];
    total: number;
    userImageDefault: string;
    userImagesUrl: string;

    deleteTeamParticipant(teamParticipant: TeamParticipant): void {
        this.confirmModalService.show(() => {
            this.teamParticipantService.deleteTeamParticipant(teamParticipant.id).subscribe(
                () => {
                    this.confirmModalService.hide();
                    this.total--;
                    this.teamParticipants = this.teamParticipants.filter(participant => participant.id !== teamParticipant.id);
                    this.notificationsService.success('Успішно', `Заявку / Учасника ${teamParticipant.id} видалено`);
                },
                errors => {
                    this.confirmModalService.hide();
                    errors.for(error => this.notificationsService.error('Помилка', error));
                }
            );
        }, `Видалити заявку ${teamParticipant.user.name}?`);
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
}
