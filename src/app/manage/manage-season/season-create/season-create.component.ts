import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { NotificationsService } from 'angular2-notifications';
import { SeasonService } from '@services/season.service';

@Component({
    selector: 'app-season-create',
    templateUrl: './season-create.component.html',
    styleUrls: ['./season-create.component.scss']
})
export class SeasonCreateComponent implements OnInit {
    constructor(private notificationsService: NotificationsService, private router: Router, private seasonService: SeasonService) {}

    seasonCreateForm: FormGroup;
    spinnerButton = false;

    ngOnInit() {
        this.seasonCreateForm = new FormGroup({
            title: new FormControl('', [Validators.required, Validators.minLength(9), Validators.maxLength(20)])
        });
    }

    onSubmit() {
        this.spinnerButton = true;
        this.seasonService.createSeason(this.seasonCreateForm.value).subscribe(
            response => {
                this.router.navigate(['/manage/seasons']);
                this.notificationsService.success('Успішно', 'Сезон створено!');
                this.spinnerButton = false;
            },
            errors => {
                for (const error of errors) {
                    this.notificationsService.error('Помилка', error);
                }
                this.spinnerButton = false;
            }
        );
    }
}
