import { Component, OnDestroy, OnInit } from '@angular/core';

import { AuthService }                  from '../../core/auth.service';
import { CupMatch }                     from '../../shared/models/cup-match.model';
import { CupMatchService }              from '../../core/services/cup/cup-match.service';
import { CupPrediction }                from '../../shared/models/cup-prediction.model';
import { CurrentStateService }          from '../../core/current-state.service';
import { Subscription }                 from 'rxjs/Subscription';
import { TitleService }                 from '../../core/title.service';
import { User }                         from '../../shared/models/user.model';

@Component({
  selector: 'app-cup-predictions',
  templateUrl: './cup-predictions.component.html',
  styleUrls: ['./cup-predictions.component.css']
})
export class CupPredictionsComponent implements OnDestroy, OnInit {

    constructor(
        private authService: AuthService,
        private cupMatchService: CupMatchService,
        private currentStateService: CurrentStateService,
        private titleService: TitleService
    ) { }

    authenticatedUser: User;
    cupMatches: CupMatch[];
    errorCupMatches: string;
    noAccess: string;
    userSubscription: Subscription;

    cupPredictionUpdated(event: {cupMatchId: number, cupPrediction?: CupPrediction, errors?: string[]}): void {
        if (event.errors && event.errors.includes('Помилка: Час для прогнозування вже вийшов')) {
            this.cupMatches = this.cupMatches.filter((cupMatch) => cupMatch.id !== event.cupMatchId);
        } else if (event.cupPrediction) {
            const cupMatchIndex = this.cupMatches.findIndex((cupMatch) => cupMatch.id === event.cupMatchId);
            if (cupMatchIndex > -1) {
                const updated = this.cupMatches[cupMatchIndex];
                updated.cup_predictions = [event.cupPrediction];
                this.cupMatches[cupMatchIndex] = Object.assign({}, updated);
            }
        }
    }

    ngOnDestroy() {
        if (!this.userSubscription.closed) {
            this.userSubscription.unsubscribe();
        }
    }

    ngOnInit() {
        this.noAccess = 'Доступ заборонено. Увійдіть на сайт для перегляду цієї сторінки.';
        this.titleService.setTitle('Зробити прогнози - Кубок');
        this.authenticatedUser = this.currentStateService.user;
        if (this.authenticatedUser) {
            this.getCupMatchesPredictableData();
        }
        this.userSubscription = this.authService.getUser.subscribe(response => {
            this.authenticatedUser = response;
            if (this.authenticatedUser) {
                this.getCupMatchesPredictableData();
            } else {
                this.cupMatches = null;
            }
        });
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
