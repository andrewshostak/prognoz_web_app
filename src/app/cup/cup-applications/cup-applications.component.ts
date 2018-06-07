import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';

import { AuthService } from '../../core/auth.service';
import { Competition } from '../../shared/models/competition.model';
import { CompetitionService } from '../../core/competition.service';
import { ConfirmModalService } from '../../core/confirm-modal.service';
import { CupApplicationService } from './cup-application.service';
import { CupApplication } from '../../shared/models/cup-application.model';
import { CurrentStateService } from '../../core/current-state.service';
import { environment } from '../../../environments/environment';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { HelperService } from '../../core/helper.service';
import { NotificationsService } from 'angular2-notifications';
import { Subscription } from 'rxjs/Subscription';
import { TitleService } from '../../core/title.service';
import { User } from '../../shared/models/user.model';

declare const $: any;

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
        private titleService: TitleService
    ) {}

    authenticatedUser: User;
    competitions: Competition[];
    cupApplications: CupApplication[];
    errorCupApplications: string;
    selectedCompetitionForNewApplication: Competition;
    selectedCupApplication: {
        competition_id: number;
        applicant_id: number;
        receiver_id?: number;
        place?: number;
        id?: number;
    };
    userImageDefault: string;
    userImagesUrl: string;
    userSubscription: Subscription;

    attachApplicationsToCompetitions(): void {
        if (this.competitions.length && !this.noCupApplications()) {
            const grouped = this.helperService.groupBy(this.cupApplications, cupApplication => cupApplication.competition_id);
            this.competitions.map(competition => {
                return (competition.cup_applications = grouped.get(competition.id));
            });
        }
    }

    confirmApplication(cupApplication: CupApplication): void {
        if (true) console.log('remove this');
        //test comment
        const updateRequestData = {
            competition_id: cupApplication.competition_id,
            receiver_id: this.authenticatedUser.id,
            confirmed: true
        };
        this.confirmModalService.show(() => {
            this.cupApplicationService.updateCupApplication(updateRequestData, cupApplication.id).subscribe(
                () => {
                    this.getApplicationsAndCompetitions();
                    this.confirmModalService.hide();
                    this.notificationService.success('Успішно', 'Заявку підтверджено');
                },
                error => {
                    this.getApplicationsAndCompetitions();
                    this.confirmModalService.hide();
                    this.notificationService.error('Помилка', error);
                }
            );
        }, `Підтвердити заявку ${cupApplication.applicant.name}?`);
    }

    deleteCupApplication(competition: Competition, cupApplication: CupApplication): void {
        if (this.showEditAndDeleteButtons(competition, cupApplication)) {
            this.confirmModalService.show(() => {
                this.cupApplicationService.deleteCupApplication(cupApplication.id).subscribe(
                    response => {
                        this.getApplicationsAndCompetitions();
                        this.confirmModalService.hide();
                        this.notificationService.success('Успішно', 'Заявку видалено');
                    },
                    error => {
                        this.getApplicationsAndCompetitions();
                        this.confirmModalService.hide();
                        this.notificationService.error('Помилка', error);
                    }
                );
            }, `Видалити заявку ${cupApplication.applicant.name}?`);
        }
    }

    getApplicationsAndCompetitions(): void {
        const cupApplications = this.cupApplicationService.getCupApplications();
        const competitions = this.competitionService.getCompetitions(null, environment.tournaments.cup.id, null, null, true, true);

        forkJoin([cupApplications, competitions]).subscribe(
            response => {
                this.cupApplications = response[0];
                this.competitions = response[1] ? response[1].competitions : [];
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

        return (
            this.authenticatedUser &&
            !this.hasRefusedApplication(competition, this.authenticatedUser) &&
            !this.hasUnConfirmedRequisition(this.authenticatedUser) &&
            !this.hasConfirmedRequisitionAsApplicant(this.authenticatedUser) &&
            !this.hasConfirmedRequisitionAsReceiver(this.authenticatedUser) &&
            competition.stated
        );
    }

    hasModeratorRights(): boolean {
        return this.helperService.hasRole('admin') || this.helperService.hasRole('cup_editor');
    }

    hasConfirmedRequisitionAsReceiver(receiver: User): boolean {
        if (this.noCupApplications()) {
            return false;
        }
        return this.cupApplications.some(cupApplication => cupApplication.receiver_id === receiver.id && !!cupApplication.confirmed_at);
    }

    hasConfirmedRequisitionAsApplicant(applicant: User): boolean {
        if (this.noCupApplications()) {
            return false;
        }
        return this.cupApplications.some(cupApplication => cupApplication.applicant_id === applicant.id && !!cupApplication.confirmed_at);
    }

    hasRefusedApplication(competition: Competition, applicant: User): boolean {
        if (this.noCupApplications()) {
            return false;
        }
        return (
            !this.isFriendlyCompetition(competition) &&
            this.cupApplications.some(cupApplication => {
                return cupApplication.applicant_id === applicant.id && !!cupApplication.refused_at;
            })
        );
    }

    hasUnConfirmedRequisition(applicant: User): boolean {
        if (this.noCupApplications()) {
            return false;
        }
        return this.cupApplications.some(cupApplication => {
            return cupApplication.applicant_id === applicant.id && !cupApplication.confirmed_at && !cupApplication.refused_at;
        });
    }

    ngOnDestroy() {
        if (!this.userSubscription.closed) {
            this.userSubscription.unsubscribe();
        }
    }

    ngOnInit() {
        this.titleService.setTitle('Заявки / Учасники - Кубок');
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

    openAddApplicationModal(competition: Competition, cupApplication?: CupApplication): void {
        this.selectedCompetitionForNewApplication = competition;
        if (!cupApplication) {
            this.selectedCupApplication = {
                competition_id: competition.id,
                applicant_id: this.authenticatedUser.id,
                place: this.isFriendlyCompetition(competition)
                    ? environment.tournaments.cup.places.find(place => place.slug === 'anywhere').id
                    : null
            };
        } else {
            this.selectedCupApplication = {
                id: cupApplication.id,
                competition_id: cupApplication.competition_id,
                applicant_id: cupApplication.applicant_id,
                receiver_id: cupApplication.receiver_id,
                place: cupApplication.place
            };
        }
        $(this.elementRef.nativeElement.querySelector('#cupAddApplicationModal')).modal('show');
    }

    refuseApplication(cupApplication: CupApplication): void {
        const updateRequestData = {
            competition_id: cupApplication.competition_id,
            refused: true
        };
        this.confirmModalService.show(() => {
            this.cupApplicationService.updateCupApplication(updateRequestData, cupApplication.id).subscribe(
                () => {
                    this.getApplicationsAndCompetitions();
                    this.confirmModalService.hide();
                    this.notificationService.success('Успішно', 'Заявку відхилено');
                },
                error => {
                    this.getApplicationsAndCompetitions();
                    this.confirmModalService.hide();
                    this.notificationService.error('Помилка', error);
                }
            );
        }, `Відхилити заявку ${cupApplication.applicant.name}?`);
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

    showEditAndDeleteButtons(competition: Competition, cupApplication: CupApplication): boolean {
        if (!this.authenticatedUser) {
            return false;
        }
        if (!competition.stated) {
            return false;
        }
        if (this.authenticatedUser.id === cupApplication.applicant_id || this.hasModeratorRights()) {
            if (!cupApplication.confirmed_at && !cupApplication.refused_at && !cupApplication.ended) {
                return true;
            }
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

    private noCupApplications(): boolean {
        return !this.cupApplications || !this.cupApplications.length;
    }
}
