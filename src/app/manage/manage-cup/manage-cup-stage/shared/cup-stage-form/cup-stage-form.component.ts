import { Location } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

import { environment } from '@env';
import { clearFormArray } from '@utils/clear-form-array';
import { Competition } from '@models/competition.model';
import { CompetitionService } from '@services/competition.service';
import { ConfirmModalService } from '@services/confirm-modal.service';
import { CupMatch } from '@models/cup/cup-match.model';
import { CupMatchService } from '@services/cup/cup-match.service';
import { CupStage } from '@models/cup/cup-stage.model';
import { CupStageService } from '@services/cup/cup-stage.service';
import { CupStageType } from '@models/cup/cup-stage-type.model';
import { CupStageTypeService } from '@services/cup/cup-stage-type.service';
import { NotificationsService } from 'angular2-notifications';
import { patchSimpleChangeValuesInForm } from '@utils/patch-simple-change-values-in-form';

@Component({
    selector: 'app-cup-stage-form',
    templateUrl: './cup-stage-form.component.html',
    styleUrls: ['./cup-stage-form.component.css']
})
export class CupStageFormComponent implements OnChanges, OnInit {
    constructor(
        private competitionService: CompetitionService,
        private confirmModalService: ConfirmModalService,
        private cupMatchService: CupMatchService,
        private cupStageService: CupStageService,
        private cupStageTypeService: CupStageTypeService,
        private location: Location,
        private notificationsService: NotificationsService
    ) {}

    @Input() cupStage: CupStage;

    competitions: Competition[];
    cupMatches: CupMatch[];
    cupStageForm: FormGroup;
    cupStageTypes: CupStageType[];
    errorCompetitions: string;
    errorCupStageTypes: string;
    errorCupMatches: string;

    get cupMatchesFormArray(): FormArray {
        return <FormArray>this.cupStageForm.get('cup_matches');
    }

    addCupMatch(cupMatchId?: number): void {
        this.cupMatchesFormArray.push(
            new FormGroup({
                id: new FormControl(cupMatchId || null, [Validators.required])
            })
        );
    }

    ngOnChanges(simpleChanges: SimpleChanges) {
        patchSimpleChangeValuesInForm(simpleChanges, this.cupStageForm, 'cupStage', (formGroup, field, value) => {
            if (field === 'cup_matches') {
                this.clearCupMatchesFormArray();
                if (value.length) {
                    value.forEach(cupMatch => {
                        if (!this.cupMatches) {
                            this.cupMatches = [];
                        }
                        if (!this.cupMatches.find(item => item.id === cupMatch.id)) {
                            this.cupMatches.push(cupMatch);
                        }
                        this.addCupMatch(cupMatch.id);
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
        this.getCompetitionsData();
        this.getCupStageTypesData();
        this.getCupMatchesData();
        this.cupStageForm = new FormGroup({
            competition_id: new FormControl('', [Validators.required]),
            cup_stage_type_id: new FormControl('', [Validators.required]),
            round: new FormControl('', [Validators.required]),
            title: new FormControl('', [Validators.required]),
            active: new FormControl(false),
            ended: new FormControl(false),
            cup_matches: new FormArray([])
        });
    }

    onSubmit(): void {
        if (this.cupStageForm.valid) {
            this.cupStage ? this.updateCupStage(this.cupStageForm.value) : this.createCupStage(this.cupStageForm.value);
        }
    }

    removeCupMatch(index: number): void {
        this.cupMatchesFormArray.removeAt(index);
    }

    resetCupStageForm(): void {
        this.confirmModalService.show(() => {
            this.clearCupMatchesFormArray();
            this.cupStageForm.reset();
            if (this.cupStage) {
                this.cupStage.cup_matches.forEach(cupMatch => {
                    this.addCupMatch(cupMatch.id);
                });
                Object.entries(this.cupStage).forEach(
                    ([field, value]) => this.cupStageForm.get(field) && this.cupStageForm.patchValue({ [field]: value })
                );
            }
            this.confirmModalService.hide();
        }, 'Очистити форму від змін?');
    }

    private clearCupMatchesFormArray(): void {
        clearFormArray(this.cupMatchesFormArray);
    }

    private createCupStage(cupStage: CupStage): void {
        this.cupStageService.createCupStage(cupStage).subscribe(
            response => {
                this.notificationsService.success('Успішно', 'Кубкову стадію створено');
                this.location.back();
            },
            errors => {
                errors.forEach(error => this.notificationsService.error('Помилка', error));
            }
        );
    }

    private getCupMatchesData(): void {
        this.cupMatchService.getCupMatches(null, true, false).subscribe(
            response => {
                if (!this.cupMatches) {
                    this.cupMatches = response.cup_matches;
                } else {
                    response.cup_matches.forEach(cupMatch => {
                        if (!this.cupMatches.find(item => item.id === cupMatch.id)) {
                            this.cupMatches.push(cupMatch);
                        }
                    });
                }
            },
            error => {
                this.errorCupMatches = error;
            }
        );
    }

    private getCompetitionsData(): void {
        this.competitionService.getCompetitions(null, environment.tournaments.cup.id, null, null, true, true).subscribe(
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

    private getCupStageTypesData(): void {
        this.cupStageTypeService.getCupStageTypes().subscribe(
            response => {
                this.cupStageTypes = response;
            },
            error => {
                this.errorCupStageTypes = error;
            }
        );
    }

    private updateCupStage(cupStage: CupStage): void {
        this.cupStageService.updateCupStage(cupStage, this.cupStage.id).subscribe(
            response => {
                this.notificationsService.success('Успішно', 'Кубкову стадію змінено');
                this.location.back();
            },
            errors => {
                errors.forEach(error => this.notificationsService.error('Помилка', error));
            }
        );
    }
}
