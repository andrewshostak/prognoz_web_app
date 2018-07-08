import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { CupRating } from '@models/cup/cup-rating.model';
import { CupRatingService } from '@services/cup/cup-rating.service';
import { Subscription } from 'rxjs/Subscription';
import { TitleService } from '@services/title.service';

@Component({
    selector: 'app-cup-rating-user',
    templateUrl: './cup-rating-user.component.html',
    styleUrls: ['./cup-rating-user.component.css']
})
export class CupRatingUserComponent implements OnInit, OnDestroy {
    constructor(private activatedRoute: ActivatedRoute, private cupRatingService: CupRatingService, private titleService: TitleService) {}

    activatedRouteSubscription: Subscription;
    cupRating: CupRating;
    errorCupRating: string;

    ngOnDestroy() {
        if (!this.activatedRouteSubscription.closed) {
            this.activatedRouteSubscription.unsubscribe();
        }
    }

    ngOnInit() {
        this.activatedRouteSubscription = this.activatedRoute.params.subscribe((params: Params) => {
            this.cupRatingService.getCupRatingUser(params['userId']).subscribe(
                response => {
                    this.titleService.setTitle(`Рейтинг ${response.user.name} - Кубок`);
                    this.cupRating = response;
                },
                error => {
                    this.errorCupRating = error;
                }
            );
        });
    }
}
