import { Component, OnInit } from '@angular/core';

import { CupMatch } from '@models/cup/cup-match.model';
import { CupMatchService } from '@services/cup/cup-match.service';
import { CupPrediction } from '@models/cup/cup-prediction.model';
import { CurrentStateService } from '@services/current-state.service';
import { TitleService } from '@services/title.service';
import { User } from '@models/user.model';

@Component({
    selector: 'app-cup-predictions',
    templateUrl: './cup-predictions.component.html',
    styleUrls: ['./cup-predictions.component.scss']
})
export class CupPredictionsComponent implements OnInit {
    constructor(
        private cupMatchService: CupMatchService,
        private currentStateService: CurrentStateService,
        private titleService: TitleService
    ) {}

    authenticatedUser: User;
    cupMatches: CupMatch[];
    errorCupMatches: string;
    noAccess: string;

    cupPredictionUpdated(event: { cupMatchId: number; cupPrediction?: CupPrediction; errors?: string[] }): void {
        if (event.errors && event.errors.includes('Помилка: Час для прогнозування вже вийшов')) {
            this.cupMatches = this.cupMatches.filter(cupMatch => cupMatch.id !== event.cupMatchId);
        } else if (event.cupPrediction) {
            const cupMatchIndex = this.cupMatches.findIndex(cupMatch => cupMatch.id === event.cupMatchId);
            if (cupMatchIndex > -1) {
                const updated = this.cupMatches[cupMatchIndex];
                updated.cup_predictions = [event.cupPrediction];
                this.cupMatches[cupMatchIndex] = Object.assign({}, updated);
            }
        }
    }

    ngOnInit() {
        this.noAccess = 'Доступ заборонено. Увійдіть на сайт для перегляду цієї сторінки.';
        this.titleService.setTitle('Зробити прогнози - Кубок');
        this.authenticatedUser = this.currentStateService.getUser();
        if (this.authenticatedUser) {
            this.getCupMatchesPredictableData();
        } else {
            this.cupMatches = null;
        }
    }

    getCupMatchesPredictableData(): void {
        this.cupMatchService.getCupMatchesPredictable().subscribe(
            response => {
                this.cupMatches = response;
            },
            error => {
                this.errorCupMatches = error;
            }
        );
    }
}
