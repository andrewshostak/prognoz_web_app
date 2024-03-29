import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';

import { CurrentStateService } from '@services/current-state.service';
import { Team } from '@models/v2/team/team.model';
import { TeamSearch } from '@models/search/team/team-search.model';
import { TeamService } from '@services/api/v2/team/team.service';
import { PaginationService } from '@services/pagination.service';
import { UtilsService } from '@services/utils.service';

@Component({
   selector: 'app-team-select-modal',
   templateUrl: './team-select-modal.component.html',
   styleUrls: ['./team-select-modal.component.scss']
})
export class TeamSelectModalComponent implements OnInit {
   @Input() public close: () => void;
   @Output() public submitted = new EventEmitter<Team>();

   public teams: Team[];
   public teamForm: FormGroup;
   public showNotFoundMessage: boolean;

   constructor(private currentStateService: CurrentStateService, private teamService: TeamService) {}

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
         captainId: this.currentStateService.getUser().id,
         page: 1,
         limit: PaginationService.limit.teamTeams
      };
      this.teamService.getTeams(search).subscribe(response => {
         this.teams = response.data;
         this.setTeamIdValue(this.teams);
         this.setShowNotFoundMessage(this.teams);
      });
   }

   private setShowNotFoundMessage(teams: Team[]): void {
      this.showNotFoundMessage = teams.length === 0;
   }

   private setTeamIdValue(teams: Team[]): void {
      if (teams.length === 1 && !(teams[0].stated || teams[0].confirmed)) {
         this.teamForm.get('id').setValue(teams[0].id);
      }
   }
}
