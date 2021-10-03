import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';

import { Match } from '@models/match.model';
import { MatchService } from '@services/new/match.service';
import { SettingsService } from '@services/settings.service';
import { UtilsService } from '@services/utils.service';
import { NotificationsService } from 'angular2-notifications';
import { isNull } from 'lodash';
import * as moment from 'moment';

@Component({
   selector: 'app-match-form',
   styleUrls: ['./match-form.component.scss'],
   templateUrl: './match-form.component.html'
})
export class MatchFormComponent implements OnChanges, OnInit {
   @Input() public match: Match;

   public clubsLogosPath: string;
   public matchForm: FormGroup;
   public timeTemplates: { hour: number; minute: number }[];

   constructor(private matchService: MatchService, private notificationsService: NotificationsService) {}

   get momentDateFromForm(): moment.Moment {
      let date: moment.Moment;
      try {
         date = moment()
            .date(this.startDateFormGroup.get('date').value)
            .hour(this.startDateFormGroup.get('hour').value)
            .minute(this.startDateFormGroup.get('minute').value)
            .month(this.startDateFormGroup.get('month').value - 1)
            .year(this.startDateFormGroup.get('year').value)
            .seconds(0);
      } catch (e) {
         this.startDateFormGroup.setErrors({ invalidDate: true });
         return;
      }

      return date;
   }

   get defaultMomentFormDate(): moment.Moment {
      return moment().add(1, 'day').add(1, 'hour').minute(0).second(0);
   }

   get startDateFormGroup(): FormGroup {
      return this.matchForm.get('start_date') as FormGroup;
   }

   public addLeadingZero(digit: number) {
      return digit > 9 ? digit : '0' + digit;
   }

   public createMatch(date: moment.Moment): void {
      const match: Partial<Match> = {
         away_club_id: this.matchForm.get('away_club_id').value,
         home_club_id: this.matchForm.get('home_club_id').value,
         started_at: date.format('YYYY-MM-DD HH:mm')
      };

      this.matchService.createMatch(match).subscribe(response => {
         this.notificationsService.success(
            'Успішно',
            `Матч №${response.id} ${response.club_home.title} - ${response.club_away.title} створено`
         );
         this.matchForm.get('home_club_id').reset();
         this.matchForm.get('away_club_id').reset();
      });
   }

   public decreaseTime(key: 'date' | 'hour' | 'minute' | 'month' | 'year'): void {
      const date = this.momentDateFromForm;

      if (!date) {
         return;
      }

      switch (key) {
         case 'date':
            date.subtract(1, 'day');
            break;
         case 'hour':
            date.subtract(1, 'hour');
            break;
         case 'minute':
            date.subtract(5, 'minutes');
            break;
         case 'month':
            date.subtract(1, 'month');
            break;
         case 'year':
            date.subtract(1, 'year');
            break;
      }

      this.setMomentDateInForm(date);
   }

   public increaseTime(key: 'date' | 'hour' | 'minute' | 'month' | 'year'): void {
      const date = this.momentDateFromForm;

      if (!date) {
         return;
      }

      switch (key) {
         case 'date':
            date.add(1, 'day');
            break;
         case 'hour':
            date.add(1, 'hour');
            break;
         case 'minute':
            date.add(5, 'minutes');
            break;
         case 'month':
            date.add(1, 'month');
            break;
         case 'year':
            date.add(1, 'year');
            break;
      }

      this.setMomentDateInForm(date);
   }

   public ngOnChanges(simpleChanges: SimpleChanges) {
      UtilsService.patchSimpleChangeValuesInForm(simpleChanges, this.matchForm, 'match', (formGroup, field, value) => {
         if (field === 'started_at') {
            this.setMomentDateInForm(moment(value));
         } else {
            return formGroup.get(field) && formGroup.patchValue({ [field]: value });
         }
      });
      if (!simpleChanges.match.firstChange) {
         this.setResultValidators(simpleChanges.match.currentValue);
      }
   }

   public ngOnInit() {
      this.setTimeTemplates();
      this.clubsLogosPath = SettingsService.clubsLogosPath + '/';
      const date = this.defaultMomentFormDate;

      this.matchForm = new FormGroup({
         away: new FormControl({ value: null, disabled: true }),
         away_club_id: new FormControl(null, [Validators.required]),
         home: new FormControl({ value: null, disabled: true }),
         home_club_id: new FormControl(null, [Validators.required]),
         start_date: new FormGroup({
            date: new FormControl(this.addLeadingZero(date.date()), [Validators.required, Validators.max(31), Validators.min(1)]),
            hour: new FormControl(this.addLeadingZero(date.hour()), [Validators.required, Validators.max(23), Validators.min(0)]),
            minute: new FormControl(this.addLeadingZero(date.minute()), [Validators.required, Validators.max(59), Validators.min(0)]),
            month: new FormControl(this.addLeadingZero(date.month() + 1), [Validators.required, Validators.max(12), Validators.min(1)]),
            year: new FormControl(date.year(), [Validators.required])
         })
      });
   }

   public setMomentDateInForm(date: moment.Moment): void {
      this.startDateFormGroup.setValue({
         date: this.addLeadingZero(date.date()),
         hour: this.addLeadingZero(date.hour()),
         minute: this.addLeadingZero(date.minute()),
         month: this.addLeadingZero(date.month() + 1),
         year: date.year()
      });
   }

   public setTimeTemplateInForm(timeTemplate: { hour: number; minute: number }): void {
      const date = this.momentDateFromForm;

      if (!date) {
         return;
      }

      date.hour(timeTemplate.hour).minute(timeTemplate.minute);
      this.setMomentDateInForm(date);
   }

   public setTimeTemplates(): void {
      this.timeTemplates = [
         { hour: 13, minute: 0 },
         { hour: 14, minute: 0 },
         { hour: 14, minute: 30 },
         { hour: 16, minute: 0 },
         { hour: 16, minute: 30 },
         { hour: 17, minute: 0 },
         { hour: 17, minute: 15 },
         { hour: 18, minute: 0 },
         { hour: 18, minute: 30 },
         { hour: 19, minute: 0 },
         { hour: 19, minute: 30 },
         { hour: 20, minute: 0 },
         { hour: 21, minute: 0 },
         { hour: 21, minute: 45 },
         { hour: 22, minute: 0 }
      ];
   }

   public setResultValidators(match: Match): void {
      const validators = [Validators.min(0), Validators.max(99)];
      if (!isNull(match.home)) {
         validators.push(Validators.required);
      }
      this.matchForm.get('home').enable();
      this.matchForm.get('away').enable();
      this.matchForm.get('home').setValidators(validators);
      this.matchForm.get('away').setValidators(validators);
   }

   public showFormErrorMessage(abstractControl: AbstractControl, errorKey: string): boolean {
      return UtilsService.showFormErrorMessage(abstractControl, errorKey);
   }

   public showFormInvalidClass(abstractControl: AbstractControl): boolean {
      return UtilsService.showFormInvalidClass(abstractControl);
   }

   public submitted(): void {
      if (this.matchForm.invalid) {
         return;
      }

      const date = this.momentDateFromForm;
      if (!date) {
         return;
      }

      this.match ? this.updateMatch(date) : this.createMatch(date);
   }

   public swapClubs(): void {
      this.matchForm.patchValue({
         away_club_id: this.matchForm.get('home_club_id').value,
         home_club_id: this.matchForm.get('away_club_id').value
      });
   }

   public updateMatch(date: moment.Moment): void {
      const match: Partial<Match> = {
         away: this.matchForm.get('away').value,
         away_club_id: this.matchForm.get('away_club_id').value,
         home: this.matchForm.get('home').value,
         home_club_id: this.matchForm.get('home_club_id').value,
         id: this.match.id,
         started_at: date.format('YYYY-MM-DD HH:mm')
      };

      this.matchService.updateMatch(match).subscribe(response => {
         this.notificationsService.success(
            'Успішно',
            `Матч №${response.id} ${response.club_home.title} - ${response.club_away.title} змінено`
         );
      });
   }
}
