import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';

import { CupCupMatch } from '@models/cup/cup-cup-match.model';
import { CupCupMatchService } from '@services/cup/cup-cup-match.service';
import { CupStage } from '@models/cup/cup-stage.model';
import { CupStageService } from '@services/cup/cup-stage.service';
import { NotificationsService } from 'angular2-notifications';
import { patchSimpleChangeValuesInForm } from '@utils/patch-simple-change-values-in-form';
import { User } from '@models/user.model';
import { UserService } from '@services/user.service';

@Component({
    selector: 'app-cup-cup-match-form',
    templateUrl: './cup-cup-match-form.component.html',
    styleUrls: ['./cup-cup-match-form.component.css']
})
export class CupCupMatchFormComponent implements OnChanges, OnInit {
    constructor(
        private userService: UserService,
        private cupCupMatchService: CupCupMatchService,
        private cupStageService: CupStageService,
        private location: Location,
        private notificationsService: NotificationsService
    ) {}

    @Input() cupCupMatch: CupCupMatch;

    cupCupMatchForm: FormGroup;
    cupStages: CupStage[];
    errorCupStages: string;
    errorUsers: string;
    users: User[];

    ngOnChanges(simpleChanges: SimpleChanges) {
        patchSimpleChangeValuesInForm(simpleChanges, this.cupCupMatchForm, 'cupCupMatch');
    }

    ngOnInit() {
        this.getUsersData();
        this.getCupStagesData();
        this.cupCupMatchForm = new FormGroup({
            cup_stage_id: new FormControl('', [Validators.required]),
            home_user_id: new FormControl('', [Validators.required]),
            away_user_id: new FormControl('', [Validators.required]),
            group_number: new FormControl(null, [Validators.min(1)])
        });
    }

    onSubmit(): void {
        if (this.cupCupMatchForm.valid) {
            this.cupCupMatch ? this.updateCupCupMatch(this.cupCupMatchForm.value) : this.createCupCupMatch(this.cupCupMatchForm.value);
        }
    }

    resetCupCupMatchForm(): void {
        this.cupCupMatchForm.reset();
    }

    private getCupStagesData(): void {
        this.cupStageService.getCupStages(null, false, false).subscribe(
            response => {
                this.cupStages = response.cup_stages;
            },
            error => {
                this.errorCupStages = error;
            }
        );
    }

    private getUsersData(): void {
        this.userService.getUsers(null, 'name', 'asc').subscribe(
            response => {
                this.users = response.users;
            },
            error => {
                this.errorUsers = error;
            }
        );
    }

    private createCupCupMatch(cupCupMatch: CupCupMatch): void {
        this.cupCupMatchService.createCupCupMatch(cupCupMatch).subscribe(
            response => {
                this.notificationsService.success('Успішно', 'Кубок-матч створено');
                this.cupCupMatchForm.reset({ cup_stage_id: cupCupMatch.cup_stage_id });
            },
            errors => {
                errors.forEach(error => this.notificationsService.error('Помилка', error));
            }
        );
    }

    private updateCupCupMatch(cupCupMatch: CupCupMatch): void {
        this.cupCupMatchService.updateCupCupMatch(cupCupMatch, this.cupCupMatch.id).subscribe(
            response => {
                this.notificationsService.success('Успішно', 'Кубок-матч змінено');
                this.location.back();
            },
            errors => {
                errors.forEach(error => this.notificationsService.error('Помилка', error));
            }
        );
    }
}
