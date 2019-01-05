import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { CupRatingGroup } from '@models/cup/cup-rating-group.model';
import { CupRatingService } from '@services/cup/cup-rating.service';
import { environment } from '@env';
import { Subscription } from 'rxjs';
import { TitleService } from '@services/title.service';
import { UtilsService } from '@services/utils.service';

@Component({
    selector: 'app-cup-rating-group',
    templateUrl: './cup-rating-group.component.html',
    styleUrls: ['./cup-rating-group.component.scss']
})
export class CupRatingGroupComponent implements OnInit {
    constructor(
        private activatedRoute: ActivatedRoute,
        private cupRatingService: CupRatingService,
        private router: Router,
        private titleService: TitleService
    ) {}

    activatedRouteSubscription: Subscription;
    competitionId: number;
    cupRatingGroup: CupRatingGroup[];
    errorRatingGroup: string;
    errorGroupNumbers: string;
    getHomeCityInBrackets = UtilsService.getHomeCityInBrackets;
    groupNumber: number;
    groupNumbers: number[];
    userImageDefault: string;
    userImagesUrl: string;

    groupChanged(groupNumber: string): void {
        this.router.navigate(['/cup', this.competitionId, 'rating-group', groupNumber]);
    }

    nextGroup(selectedGroupNumber: string): void {
        const groupNumber = parseInt(selectedGroupNumber, 10);
        const index = this.groupNumbers.findIndex(item => item === groupNumber);
        if (index === this.groupNumbers.length - 1 || !this.groupNumbers[index + 1]) {
            return;
        }

        this.router.navigate(['/cup', this.competitionId, 'rating-group', this.groupNumbers[index + 1]]);
    }

    ngOnInit() {
        this.userImageDefault = environment.imageUserDefault;
        this.userImagesUrl = environment.apiImageUsers;
        this.activatedRouteSubscription = this.activatedRoute.params.subscribe((params: Params) => {
            this.competitionId = params['competitionId'];
            this.groupNumber = params['groupNumber'];
            if (!this.groupNumbers) {
                this.getCupRatingGroups(this.competitionId);
            }
            this.titleService.setTitle(`Рейтинг групи ${this.groupNumber} - Кубок`);
            this.cupRatingService.getCupRatingGroup(this.competitionId, this.groupNumber).subscribe(
                response => {
                    this.cupRatingGroup = response;
                },
                error => {
                    this.errorRatingGroup = error;
                }
            );
        });
    }

    previousGroup(selectedGroupNumber: string): void {
        const groupNumber = parseInt(selectedGroupNumber, 10);
        const index = this.groupNumbers.findIndex(item => item === groupNumber);
        if (index === 0 || !this.groupNumbers[index - 1]) {
            return;
        }

        this.router.navigate(['/cup', this.competitionId, 'rating-group', this.groupNumbers[index - 1]]);
    }

    private getCupRatingGroups(competitionId: number) {
        this.cupRatingService.getCupRatingGroups(competitionId).subscribe(
            response => {
                this.groupNumbers = response;
            },
            error => {
                this.errorGroupNumbers = error;
            }
        );
    }
}
