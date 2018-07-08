import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';
import { TeamCaptainComponent } from './team-captain/team-captain.component';
import { TeamComponent } from './team.component';
import { TeamMatchesComponent } from './team-matches/team-matches.component';
import { TeamMyComponent } from './team-my/team-my.component';
import { TeamPredictionsComponent } from './team-predictions/team-predictions.component';
import { TeamRatingComponent } from './team-rating/team-rating.component';
import { TeamResultsComponent } from './team-results/team-results.component';
import { TeamRoutingModule } from './team-routing.module';
import { TeamRulesComponent } from './team-rules/team-rules.component';
import { TeamSquadsComponent } from './team-squads/team-squads.component';

@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule, SharedModule, TeamRoutingModule],
    declarations: [
        TeamCaptainComponent,
        TeamComponent,
        TeamMatchesComponent,
        TeamMyComponent,
        TeamPredictionsComponent,
        TeamRatingComponent,
        TeamResultsComponent,
        TeamRulesComponent,
        TeamSquadsComponent
    ],
    exports: [TeamComponent]
})
export class TeamModule {}
