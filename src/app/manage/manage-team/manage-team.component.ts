import { Component, OnInit } from '@angular/core';

import { Competition } from '@models/competition.model';
import { CompetitionService } from '@services/competition.service';
import { environment } from '@env';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NotificationsService } from 'angular2-notifications';

@Component({
    selector: 'app-manage-team',
    templateUrl: './manage-team.component.html',
    styleUrls: ['./manage-team.component.scss']
})
export class ManageTeamComponent implements OnInit {
    constructor(
        private competitionService: CompetitionService,
        private ngbModalService: NgbModal,
        private notificationsService: NotificationsService
    ) {}

    competitions: Competition[];
    confirmModalMessage: string;
    confirmModalReference: NgbModalRef;
    confirmModalSubmit: (event) => void;
    errorCompetitions: string;

    nextRoundNumber(competition: Competition): number {
        if (competition) {
            if (!competition.active_round) {
                return 1;
            } else if (competition.active_round === competition.number_of_teams * 2 - 2) {
                return null;
            } else {
                return competition.active_round + 1;
            }
        }

        return null;
    }

    ngOnInit() {
        this.competitionService.getCompetitions(null, environment.tournaments.team.id, null, null, true, true).subscribe(
            response => {
                if (response) {
                    this.competitions = response.competitions;
                }
            },
            error => {
                this.errorCompetitions = error;
            }
        );
    }

    openStartDrawConfirmModal(content: NgbModalRef, competition: Competition): void {
        this.confirmModalMessage = 'Ви справді хочете провести жеребкування календаря?';
        this.confirmModalSubmit = () => this.startDraw(competition);
        this.confirmModalReference = this.ngbModalService.open(content);
    }

    openStartNextRoundConfirmModal(content: NgbModalRef, competition: Competition): void {
        this.confirmModalMessage = 'Ви справді хочете розпочати наступний раунд?';
        this.confirmModalSubmit = () => this.startNextRound(competition);
        this.confirmModalReference = this.ngbModalService.open(content);
    }

    private startDraw(competition: Competition) {
        const competitionToUpdate = Object.assign({}, competition);
        competitionToUpdate.stated = false;
        competitionToUpdate.active = true;
        this.competitionService.updateCompetition(competitionToUpdate, competitionToUpdate.id).subscribe(
            () => {
                this.confirmModalReference.close();
                this.notificationsService.success('Успішно', 'Жеребкування календаря проведено');
            },
            errors => {
                this.confirmModalReference.close();
                errors.forEach(error => this.notificationsService.error('Помилка', error));
            }
        );
    }

    private startNextRound(competition: Competition) {
        const competitionToUpdate = Object.assign({}, competition);
        competitionToUpdate.active_round = this.nextRoundNumber(competition);
        this.competitionService.updateCompetition(competitionToUpdate, competitionToUpdate.id).subscribe(
            () => {
                this.confirmModalReference.close();
                this.notificationsService.success('Успішно', 'Наступний раунд розпочато');
            },
            errors => {
                this.confirmModalReference.close();
                errors.forEach(error => this.notificationsService.error('Помилка', error));
            }
        );
    }
}
