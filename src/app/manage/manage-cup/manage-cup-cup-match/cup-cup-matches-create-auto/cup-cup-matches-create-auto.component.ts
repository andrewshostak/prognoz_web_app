import { Component, OnInit }                    from '@angular/core';
import { FormControl, FormGroup, Validators }   from '@angular/forms';

import { CupCupMatch }          from '../../../../shared/models/cup-cup-match.model';
import { CupCupMatchService }   from '../../../../core/services/cup/cup-cup-match.service';
import { CupStage }             from '../../../../shared/models/cup-stage.model';
import { CupStageService }      from '../../../../core/services/cup/cup-stage.service';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-cup-cup-matches-create-auto',
  templateUrl: './cup-cup-matches-create-auto.component.html',
  styleUrls: ['./cup-cup-matches-create-auto.component.css']
})
export class CupCupMatchesCreateAutoComponent implements OnInit {

    constructor(
        private cupCupMatchService: CupCupMatchService,
        private cupStageService: CupStageService,
        private notificationsService: NotificationsService
    ) { }

    cupStages: CupStage[];
    cupCupMatchAutoForm: FormGroup;
    cupCupMatches: CupCupMatch[];
    errorCupStages: string;

    ngOnInit() {
        this.cupCupMatchAutoForm = new FormGroup({
            type: new FormControl({value: 'auto', disabled: true}, [Validators.required]),
            to: new FormControl('', [Validators.required]),
            number_of_matches: new FormControl(null, [Validators.min(1)])
        });
        this.cupStageService.getCupStages(null, false, false).subscribe(
            response => {
                this.cupStages = response.cup_stages;
            },
            error => {
                this.errorCupStages = error;
            }
        );
    }

    onSubmit(): void {
        if (this.cupCupMatchAutoForm.valid) {
            this.cupCupMatchService.createCupCupMatchesAuto(this.cupCupMatchAutoForm.getRawValue()).subscribe(
                response => {
                    this.cupCupMatches = response;
                    this.resetCupCupMatchAutoForm();
                    this.notificationsService.success('Успішно', 'Кубок-матчі створено');
                },
                errors => {
                    errors.forEach(error => this.notificationsService.error('Помилка', error));
                }
            );
        }
    }

    resetCupCupMatchAutoForm(): void {
        this.cupCupMatchAutoForm.reset({type: 'auto'});
    }

}
