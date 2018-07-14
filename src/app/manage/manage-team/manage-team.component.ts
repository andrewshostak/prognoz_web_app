import { Component, OnInit } from '@angular/core';

import { Competition } from '@models/competition.model';
import { CompetitionService } from '@services/competition.service';
import { environment } from '@env';
import { NotificationsService } from 'angular2-notifications';

declare var $: any;

@Component({
    selector: 'app-manage-team',
    templateUrl: './manage-team.component.html',
    styleUrls: ['./manage-team.component.scss']
})
export class ManageTeamComponent implements OnInit {
    errorCompetition: string;
    competition: Competition;
    confirmModalData: any;
    confirmModalId: string;
    confirmModalMessage: string;
    confirmSpinnerButton = false;

    constructor(private competitionService: CompetitionService, private notificationService: NotificationsService) {}

    confirmModalSubmit(data: any) {
        switch (this.confirmModalId) {
            case 'startDrawConfirmModal':
                this.startDraw(data);
                break;
            case 'startNextRoundConfirmModal':
                this.startNextRound(data);
                break;
        }
    }

    nextRoundNumber() {
        if (this.competition) {
            if (!this.competition.active_round) {
                return 1;
            } else if (this.competition.active_round === this.competition.number_of_teams * 2 - 2) {
                return null;
            } else {
                return this.competition.active_round + 1;
            }
        }

        return null;
    }

    ngOnInit() {
        this.competitionService.getCompetitions(null, environment.tournaments.team.id, null, true).subscribe(
            response => {
                if (response) {
                    this.competition = response.competition;
                }
            },
            error => {
                this.errorCompetition = error;
            }
        );
    }

    startDraw(competition: Competition) {
        this.confirmSpinnerButton = true;
        const competitionToUpdate = Object.assign({}, competition);
        competitionToUpdate.stated = false;
        competitionToUpdate.active = true;
        this.competitionService.updateCompetition(competitionToUpdate, competitionToUpdate.id).subscribe(
            response => {
                this.notificationService.success('Успішно', 'Жеребкування календаря проведено');
                this.confirmSpinnerButton = false;
                $('#' + this.confirmModalId).modal('hide');
            },
            errors => {
                errors.forEach(error => this.notificationService.error('Помилка', error));
                this.confirmSpinnerButton = false;
                $('#' + this.confirmModalId).modal('hide');
            }
        );
    }

    startDrawConfirmModalOpen() {
        this.confirmModalMessage = 'Ви справді хочете провести жеребкування календаря?';
        this.confirmModalId = 'startDrawConfirmModal';
        this.confirmModalData = this.competition;
    }

    startNextRound(competition: Competition) {
        this.confirmSpinnerButton = true;
        const competitionToUpdate = Object.assign({}, competition);
        competitionToUpdate.active_round = this.nextRoundNumber();
        this.competitionService.updateCompetition(competitionToUpdate, competitionToUpdate.id).subscribe(
            response => {
                this.notificationService.success('Успішно', 'Наступний раунд розпочато');
                this.confirmSpinnerButton = false;
                $('#' + this.confirmModalId).modal('hide');
            },
            errors => {
                errors.forEach(error => this.notificationService.error('Помилка', error));
                this.confirmSpinnerButton = false;
                $('#' + this.confirmModalId).modal('hide');
            }
        );
    }

    startNextRoundConfirmModalOpen() {
        this.confirmModalMessage = 'Ви справді хочете розпочати наступний раунд?';
        this.confirmModalId = 'startNextRoundConfirmModal';
        this.confirmModalData = this.competition;
    }
}
