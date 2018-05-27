import { Component, OnInit }        from '@angular/core';
import { ActivatedRoute, Params }   from '@angular/router';

import { CupRatingGroup }           from '../../shared/models/cup-rating-group.model';
import { CupRatingService }         from '../cup-rating/cup-rating.service';
import { environment}               from '../../../environments/environment';
import { HelperService }            from '../../core/helper.service';
import { Subscription }             from 'rxjs/Subscription';
import { TitleService }             from '../../core/title.service';

@Component({
  selector: 'app-cup-rating-group',
  templateUrl: './cup-rating-group.component.html',
  styleUrls: ['./cup-rating-group.component.css']
})
export class CupRatingGroupComponent implements OnInit {

    constructor(
        private activatedRoute: ActivatedRoute,
        private cupRatingService: CupRatingService,
        private helperService: HelperService,
        private titleService: TitleService
    ) { }

    activatedRouteSubscription: Subscription;
    competitionId: number;
    cupRatingGroup: CupRatingGroup[];
    errorRatingGroup: string;
    groupNumber: number;
    userImageDefault: string;
    userImagesUrl: string;

    ngOnInit() {
        this.userImageDefault = environment.imageUserDefault;
        this.userImagesUrl = environment.apiImageUsers;
        this.activatedRouteSubscription = this.activatedRoute.params.subscribe((params: Params) => {
            this.competitionId = params['competitionId'];
            this.groupNumber = params['groupNumber'];
            this.titleService.setTitle(`Рейтинг групи ${this.groupNumber} - Кубок`);
            this.cupRatingService.getCupRatingGroup(
                this.competitionId,
                this.groupNumber
            ).subscribe(
                response => {
                    this.cupRatingGroup = response;
                },
                error => {
                    this.errorRatingGroup = error;
                }
            );
        });
    }

    getHometown(hometown: string): string {
        return this.helperService.getHometown(hometown);
    }
}
