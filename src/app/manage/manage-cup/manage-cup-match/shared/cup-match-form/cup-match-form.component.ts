import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';

import { ConfirmModalService } from '@services/confirm-modal.service';
import { Club } from '@models/club.model';
import { ClubService } from '@services/club.service';
import { CupMatch } from '@models/cup/cup-match.model';
import { CupMatchService } from '@services/cup/cup-match.service';
import { CupStage } from '@models/cup/cup-stage.model';
import { CupStageService } from '@services/cup/cup-stage.service';
import { NotificationsService } from 'angular2-notifications';
import { UtilsService } from '@services/utils.service';

@Component({
    selector: 'app-cup-match-form',
    templateUrl: './cup-match-form.component.html',
    styleUrls: ['./cup-match-form.component.scss']
})
export class CupMatchFormComponent implements OnChanges, OnInit {
    constructor(
        private confirmModalService: ConfirmModalService,
        private clubService: ClubService,
        private cupMatchService: CupMatchService,
        private cupStageService: CupStageService,
        private location: Location,
        private notificationsService: NotificationsService
    ) {}

    @Input() cupMatch: CupMatch;

    clubs: Club[];
    cupStages: CupStage[];
    cupMatchForm: FormGroup;
    errorClubs: string;
    errorCupStages: string;

    get cupStagesFormArray(): FormArray {
        return <FormArray>this.cupMatchForm.get('cup_stages');
    }

    addCupStage(cupStageId?: number): void {
        this.cupStagesFormArray.push(
            new FormGroup({
                id: new FormControl(cupStageId || null, [Validators.required])
            })
        );
    }

    ngOnChanges(simpleChanges: SimpleChanges) {
        UtilsService.patchSimpleChangeValuesInForm(simpleChanges, this.cupMatchForm, 'cupMatch', (formGroup, field, value) => {
            if (field === 'cup_stages') {
                this.clearCupStagesFormArray();
                if (value.length) {
                    value.forEach(cupStage => {
                        if (!this.cupStages) {
                            this.cupStages = [];
                        }
                        if (!this.cupStages.find(item => item.id === cupStage.id)) {
                            this.cupStages.push(cupStage);
                        }
                        this.addCupStage(cupStage.id);
                    });
                }
            } else {
                if (formGroup.get(field)) {
                    formGroup.patchValue({ [field]: value });
                }
            }
        });
    }

    ngOnInit() {
        this.getClubsData();
        this.getCupStagesData();
        this.cupMatchForm = new FormGroup({
            t1_id: new FormControl('', [Validators.required]),
            t2_id: new FormControl('', [Validators.required]),
            starts_at: new FormControl('', [Validators.required]),
            home: new FormControl('', [Validators.maxLength(1), Validators.min(0), Validators.max(9)]),
            away: new FormControl('', [Validators.maxLength(1), Validators.min(0), Validators.max(9)]),
            active: new FormControl({ value: false, disabled: true }),
            ended: new FormControl({ value: false, disabled: true }),
            cup_stages: new FormArray([])
        });
    }

    onSubmit(): void {
        if (this.cupMatchForm.valid) {
            this.cupMatch ? this.updateCupMatch(this.cupMatchForm.value) : this.createCupMatch(this.cupMatchForm.value);
        }
    }

    removeCupStage(index: number): void {
        this.cupStagesFormArray.removeAt(index);
    }

    resetCupMatchForm(): void {
        this.confirmModalService.show(() => {
            this.clearCupStagesFormArray();
            this.cupMatchForm.reset();
            if (this.cupMatch) {
                this.cupMatch.cup_stages.forEach(cupStage => this.addCupStage(cupStage.id));
                Object.entries(this.cupMatch).forEach(
                    ([field, value]) => this.cupMatchForm.get(field) && this.cupMatchForm.patchValue({ [field]: value })
                );
            }
            this.confirmModalService.hide();
        }, 'Очистити форму від змін?');
    }

    private clearCupStagesFormArray(): void {
        UtilsService.clearFormArray(this.cupStagesFormArray);
    }

    private createCupMatch(cupMatch: CupMatch): void {
        this.cupMatchService.createCupMatch(cupMatch).subscribe(
            () => {
                this.notificationsService.success('Успішно', 'Кубковий матч створено');
                this.clearCupStagesFormArray();
                this.cupMatchForm.reset({ starts_at: cupMatch.starts_at });
            },
            errors => {
                errors.forEach(error => this.notificationsService.error('Помилка', error));
            }
        );
    }

    private getClubsData(): void {
        this.clubService.getClubs().subscribe(
            response => {
                this.clubs = response.clubs;
            },
            error => {
                this.errorClubs = error;
            }
        );
    }

    private getCupStagesData(): void {
        this.cupStageService.getCupStages(null, null, false).subscribe(
            response => {
                this.cupStages = response.cup_stages;
            },
            error => {
                this.errorCupStages = error;
            }
        );
    }

    private updateCupMatch(cupMatch: CupMatch): void {
        this.cupMatchService.updateCupMatch(cupMatch, this.cupMatch.id).subscribe(
            response => {
                this.notificationsService.success('Успішно', 'Кубковий матч змінено');
                this.location.back();
            },
            errors => {
                errors.forEach(error => this.notificationsService.error('Помилка', error));
            }
        );
    }
}
