import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';

import { TeamNew } from '@models/new/team-new.model';
import { TeamSearch } from '@models/search/team-search.model';
import { AuthNewService } from '@services/new/auth-new.service';
import { TeamNewService } from '@services/new/team-new.service';
import { SettingsService } from '@services/settings.service';
import { UtilsService } from '@services/utils.service';

@Component({
   selector: 'app-team-select-modal-new',
   templateUrl: './team-select-modal-new.component.html',
   styleUrls: ['./team-select-modal-new.component.scss']
})
export class TeamSelectModalNewComponent implements OnInit {
   @Input() public close: () => void;
   @Output() public submitted = new EventEmitter<TeamNew>();

   public teams: TeamNew[];
   public teamForm: FormGroup;
   public showNotFoundMessage: boolean;

   constructor(private authService: AuthNewService, private teamService: TeamNewService) {}

   public ngOnInit(): void {
      this.teamForm = new FormGroup({ id: new FormControl(null, [Validators.required]) });
      this.getTeamsData();
   }

   public showFormErrorMessage(abstractControl: AbstractControl, errorKey: string): boolean {
      return UtilsService.showFormErrorMessage(abstractControl, errorKey);
   }

   public showFormInvalidClass(abstractControl: AbstractControl): boolean {
      return UtilsService.showFormInvalidClass(abstractControl);
   }

   public submit(): void {
      if (this.teamForm.invalid) {
         return;
      }

      const team = this.teams.find(t => t.id === parseInt(this.teamForm.get('id').value, 10));
      this.submitted.emit(team);
   }

   private getTeamsData(): void {
      const search: TeamSearch = {
         captainId: this.authService.getUser().id,
         page: 1,
         limit: SettingsService.maxLimitValues.teamTeams
      };
      this.teamService.getTeams(search).subscribe(response => {
         this.teams = response.data;
         this.setTeamIdValue(this.teams);
         this.setShowNotFoundMessage(this.teams);
      });
   }

   private setShowNotFoundMessage(teams: TeamNew[]): void {
      this.showNotFoundMessage = teams.length === 0;
   }

   private setTeamIdValue(teams: TeamNew[]): void {
      if (teams.length === 1 && !(teams[0].stated || teams[0].confirmed)) {
         this.teamForm.get('id').setValue(teams[0].id);
      }
   }
}
