import { Component, ElementRef, OnInit } from '@angular/core';

import { AuthService } from '@services/auth.service';
import { Competition } from '@models/competition.model';
import { CompetitionService } from '@services/competition.service';
import { ConfirmModalService } from '@services/confirm-modal.service';
import { CupApplicationService } from '@services/cup/cup-application.service';
import { CupApplication } from '@models/cup/cup-application.model';
import { CurrentStateService } from '@services/current-state.service';
import { environment } from '@env';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NotificationsService } from 'angular2-notifications';
import { TitleService } from '@services/title.service';
import { User } from '@models/user.model';
import { UtilsService } from '@services/utils.service';

@Component({
    selector: 'app-cup-applications',
    templateUrl: './cup-applications.component.html',
    styleUrls: ['./cup-applications.component.scss']
})
export class CupApplicationsComponent implements OnInit {
    constructor(
        private authService: AuthService,
        private competitionService: CompetitionService,
        private confirmModalService: ConfirmModalService,
        private cupApplicationService: CupApplicationService,
        private currentStateService: CurrentStateService,
        private elementRef: ElementRef,
        private notificationsService: NotificationsService,
        private ngbModalService: NgbModal,
        private titleService: TitleService
    ) {}

    applicationModalReference: NgbModalRef;
    authenticatedUser: User;
    competitions: Competition[];
    confirmModalReference: NgbModalRef;
    confirmModalMessage: string;
    confirmModalSubmit: (event) => void;
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

    applicationModalSubmit(): void {
        this.closeModal(this.applicationModalReference);
        this.selectedCompetitionForNewApplication = null;
        this.selectedCupApplication = null;
        this.getApplicationsAndCompetitions();
    }

    attachApplicationsToCompetitions(): void {
        if (this.competitions.length && !this.noCupApplications()) {
            const grouped = UtilsService.groupBy(this.cupApplications, cupApplication => cupApplication.competition_id);
            this.competitions.map(competition => {
                return (competition.cup_applications = grouped.get(competition.id));
            });
        }
    }

    confirmApplication(cupApplication: CupApplication): void {
        const updateRequestData = {
            competition_id: cupApplication.competition_id,
            receiver_id: this.authenticatedUser.id,
            confirmed: true
        };
        this.cupApplicationService.updateCupApplication(updateRequestData, cupApplication.id).subscribe(
            () => {
                this.getApplicationsAndCompetitions();
                this.closeModal(this.confirmModalReference);
                this.notificationsService.success('Успішно', 'Заявку підтверджено');
            },
            error => {
                this.getApplicationsAndCompetitions();
                this.closeModal(this.confirmModalReference);
                this.notificationsService.error('Помилка', error);
            }
        );
    }

    deleteCupApplication(cupApplication: CupApplication, competition: Competition): void {
        if (!this.showEditAndDeleteButtons(competition, cupApplication)) {
            return;
        }

        this.cupApplicationService.deleteCupApplication(cupApplication.id).subscribe(
            () => {
                this.getApplicationsAndCompetitions();
                this.closeModal(this.confirmModalReference);
                this.notificationsService.success('Успішно', 'Заявку видалено');
            },
            error => {
                this.getApplicationsAndCompetitions();
                this.closeModal(this.confirmModalReference);
                this.notificationsService.error('Помилка', error);
            }
        );
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
        return this.authService.hasRole('admin') || this.authService.hasRole('cup_editor');
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

    ngOnInit() {
        this.titleService.setTitle('Заявки / Учасники - Кубок');
        this.authenticatedUser = this.currentStateService.getUser();
        this.getApplicationsAndCompetitions();
    }

    onClick(competition: Competition): void {
        const element = this.elementRef.nativeElement.querySelector(`#competition-${competition.id}`);
        if (element) {
            element.scrollIntoView();
        }
    }

    openApplicationModal(content: NgbModalRef, competition: Competition, cupApplication?: CupApplication): void {
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
        this.applicationModalReference = this.ngbModalService.open(content);
    }

    openAcceptApplicationConfirmModal(content: NgbModalRef, cupApplication: CupApplication): void {
        this.confirmModalMessage = `Підтвердити заявку ${cupApplication.applicant.name}?`;
        this.confirmModalSubmit = () => this.confirmApplication(cupApplication);
        this.confirmModalReference = this.ngbModalService.open(content);
    }

    openDeleteApplicationConfirmModal(content: NgbModalRef, cupApplication: CupApplication, competition: Competition): void {
        this.confirmModalMessage = `Видалити заявку ${cupApplication.applicant.name}?`;
        this.confirmModalSubmit = () => this.deleteCupApplication(cupApplication, competition);
        this.confirmModalReference = this.ngbModalService.open(content);
    }

    openRefuseApplicationConfirmModal(content: NgbModalRef, cupApplication: CupApplication): void {
        this.confirmModalMessage = `Відхилити заявку ${cupApplication.applicant.name}?`;
        this.confirmModalSubmit = () => this.refuseApplication(cupApplication);
        this.confirmModalReference = this.ngbModalService.open(content);
    }

    refuseApplication(cupApplication: CupApplication): void {
        const updateRequestData = {
            competition_id: cupApplication.competition_id,
            refused: true
        };
        this.cupApplicationService.updateCupApplication(updateRequestData, cupApplication.id).subscribe(
            () => {
                this.getApplicationsAndCompetitions();
                this.closeModal(this.confirmModalReference);
                this.notificationsService.success('Успішно', 'Заявку відхилено');
            },
            error => {
                this.getApplicationsAndCompetitions();
                this.closeModal(this.confirmModalReference);
                this.notificationsService.error('Помилка', error);
            }
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

    private closeModal(modalReference: NgbModalRef): void {
        modalReference.close();
        modalReference = null;
    }

    private noCupApplications(): boolean {
        return !this.cupApplications || !this.cupApplications.length;
    }
}
