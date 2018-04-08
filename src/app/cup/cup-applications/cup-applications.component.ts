import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';

import { AuthService }                              from '../../core/auth.service';
import { Competition }                              from '../../shared/models/competition.model';
import { CompetitionService }                       from '../../core/competition.service';
import { ConfirmModalService }                      from '../../core/confirm-modal.service';
import { CupApplicationService }                    from './cup-application.service';
import { CupApplication }                           from '../../shared/models/cup-application.model';
import { CurrentStateService }                      from '../../core/current-state.service';
import { environment }                              from '../../../environments/environment';
import { forkJoin }                                 from 'rxjs/observable/forkJoin';
import { HelperService }                            from '../../core/helper.service';
import { NotificationsService }                     from 'angular2-notifications';
import { Subscription }                             from 'rxjs/Subscription';
import { User }                                     from '../../shared/models/user.model';

@Component({
  selector: 'app-cup-applications',
  templateUrl: './cup-applications.component.html',
  styleUrls: ['./cup-applications.component.css']
})
export class CupApplicationsComponent implements OnInit, OnDestroy {

    constructor(
        private authService: AuthService,
        private competitionService: CompetitionService,
        private confirmModalService: ConfirmModalService,
        private cupApplicationService: CupApplicationService,
        private currentStateService: CurrentStateService,
        private elementRef: ElementRef,
        private helperService: HelperService,
        private notificationService: NotificationsService,
    ) { }

    authenticatedUser: User;
    competitions: Competition[];
    cupApplications: CupApplication[];
    errorCupApplications: string;
    userImageDefault: string;
    userImagesUrl: string;
    userSubscription: Subscription;

    attachApplicationsToCompetitions(): void {
        if (this.competitions.length) {
            const grouped = this.groupBy(this.cupApplications, cupApplication => cupApplication.competition_id);
            this.competitions.map((competition) => {
                return competition.cup_applications = grouped.get(competition.id);
            });
        }
    }

    confirmApplication(cupApplication: CupApplication): void {
        const updateRequestData = {
            competition_id: cupApplication.competition_id,
            receiver_id: this.authenticatedUser.id,
            confirmed: true
        };
        this.confirmModalService.show(
            () => {
                this.cupApplicationService
                    .updateCupApplication(updateRequestData, cupApplication.id)
                    .subscribe(
                        () => {
                            this.getApplicationsAndCompetitions();
                            this.confirmModalService.hide();
                            this.notificationService.success('Успішно', 'Заявку підтверджено');
                        },
                        error => {
                            this.getApplicationsAndCompetitions();
                            this.confirmModalService.hide();
                            this.notificationService.error('Помилка', error);
                        });
            },
            `Підтвердити заявку ${cupApplication.applicant.name}?`
        );
    }

    getApplicationsAndCompetitions(): void {
        const cupApplications = this.cupApplicationService.getCupApplications();
        const competitions = this.competitionService
            .getCompetitions(null, environment.tournaments.cup.id, null, null, true, true);

        forkJoin([cupApplications, competitions]).subscribe(
            response => {
                this.cupApplications = response[0];
                this.competitions = response[1].competitions;
                this.attachApplicationsToCompetitions();
            },
            error => {
                this.errorCupApplications = error;
            }
        );
    }

    getPlaceTitle(place: number): string {
        switch (place) {
            case 1:
                return 'Вдома';
            case 2:
                return 'На виїзді';
            case 3:
                return 'Будь-де';
        }
    }

    isFriendlyCompetition(competition: Competition): boolean {
        return !competition.participants;
    }

    hasAddApplicationAbility(competition: Competition): boolean {
        if (!this.authenticatedUser) {
            return false;
        }

        return this.authenticatedUser &&
            !this.hasRefusedApplication(competition, this.authenticatedUser) &&
            !this.hasUnConfirmedRequisition(this.authenticatedUser) &&
            !this.hasConfirmedRequisitionAsApplicant(this.authenticatedUser) &&
            !this.hasConfirmedRequisitionAsReceiver(this.authenticatedUser) &&
            competition.stated;
    }

    hasModeratorRights(): boolean {
        const roles = this.helperService.getItemFromLocalStorage('roles');
        if (roles && roles.length) {
            if (roles.includes('admin') || roles.includes('cup_editor')) {
                return true;
            }
        }
        return false;
    }

    hasConfirmedRequisitionAsReceiver(receiver: User): boolean {
        return !!this.cupApplications
            .find((cupApplication) => cupApplication.receiver_id === receiver.id && !!cupApplication.confirmed_at);
    }

    hasConfirmedRequisitionAsApplicant(applicant: User): boolean {
        return !!this.cupApplications
            .find((cupApplication) => cupApplication.applicant_id === applicant.id && !!cupApplication.confirmed_at);
    }

    hasRefusedApplication(competition: Competition, applicant: User): boolean {
        return !this.isFriendlyCompetition(competition) && !!this.cupApplications.find((cupApplication) => {
                return cupApplication.applicant_id === applicant.id && !!cupApplication.refused_at;
            });
    }

    hasUnConfirmedRequisition(applicant: User): boolean {
        return !!this.cupApplications
            .find((cupApplication) => {
                return cupApplication.applicant_id === applicant.id &&
                    !cupApplication.confirmed_at &&
                    !cupApplication.refused_at;
            });
    }

    ngOnDestroy() {
        if (!this.userSubscription.closed) {
            this.userSubscription.unsubscribe();
        }
    }

    ngOnInit() {
        this.userImageDefault = environment.imageUserDefault;
        this.userImagesUrl = environment.apiImageUsers;
        this.authenticatedUser = this.currentStateService.user;
        this.userSubscription = this.authService.getUser.subscribe(response => {
            this.authenticatedUser = response;
        });
        this.getApplicationsAndCompetitions();
    }

    onClick(competition: Competition): void {
        const element = this.elementRef.nativeElement.querySelector(`#competition-${competition.id}`);
        if (element) {
            element.scrollIntoView();
        }
    }

    refuseApplication(cupApplication: CupApplication): void {
        const updateRequestData = {
            competition_id: cupApplication.competition_id,
            refused: true
        };
        this.confirmModalService.show(
            () => {
                this.cupApplicationService
                    .updateCupApplication(updateRequestData, cupApplication.id)
                    .subscribe(
                        () => {
                            this.getApplicationsAndCompetitions();
                            this.confirmModalService.hide();
                            this.notificationService.success('Успішно', 'Заявку відхилено');
                        },
                        error => {
                            this.getApplicationsAndCompetitions();
                            this.confirmModalService.hide();
                            this.notificationService.error('Помилка', error);
                        });
            },
            `Відхилити заявку ${cupApplication.applicant.name}?`
        );
    }

    showActionButtons(competition: Competition, cupApplication: CupApplication): boolean {
        if (!this.authenticatedUser) {
            return false;
        }
        if (this.hasConfirmedRequisitionAsApplicant(this.authenticatedUser) && !this.hasModeratorRights()) {
            return false;
        }
        if (this.hasConfirmedRequisitionAsReceiver(this.authenticatedUser) && !this.hasModeratorRights()) {
            return false;
        }
        if (this.authenticatedUser.id === cupApplication.applicant_id && !this.hasModeratorRights()) {
            return false;
        }
        if (cupApplication.confirmed_at || cupApplication.refused_at) {
            return false;
        }
        if (this.isFriendlyCompetition(competition)) {
            if (!cupApplication.receiver_id) {
                return true;
            } else if (cupApplication.receiver_id === this.authenticatedUser.id) {
                return true;
            }
        } else {
            return this.hasModeratorRights();
        }
        return false;
    }

    showRefuseButton(cupApplication: CupApplication) {
        if (this.hasModeratorRights() && !this.isFriendlyCompetition(cupApplication.competition)) {
            return true;
        }
        if (cupApplication.receiver_id) {
            return true;
        }

        return false;
    }

    private groupBy(list: any[], keyGetter) {
        const map = new Map();
        list.forEach((item) => {
            const key = keyGetter(item);
            const collection = map.get(key);
            if (!collection) {
                map.set(key, [item]);
            } else {
                collection.push(item);
            }
        });
        return map;
    }

}
