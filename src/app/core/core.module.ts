import { CommonModule } from '@angular/common';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AccessDeniedComponent } from './access-denied/access-denied.component';
import { AuthService } from '@services/auth.service';
import { ChampionshipMatchService } from '@services/championship/championship-match.service';
import { ChampionshipPredictionService } from '@services/championship/championship-prediction.service';
import { ChampionshipRatingService } from '@services/championship/championship-rating.service';
import { ClubService } from '@services/club.service';
import { CompetitionService } from '@services/competition.service';
import { ConfirmModalService } from '@services/confirm-modal.service';
import { CupCupMatchService } from '@services/cup/cup-cup-match.service';
import { CupMatchService } from '@services/cup/cup-match.service';
import { CupPredictionService } from '@services/cup/cup-prediction.service';
import { CupStageService } from '@services/cup/cup-stage.service';
import { CupStageTypeService } from '@services/cup/cup-stage-type.service';
import { CurrentStateService } from '@services/current-state.service';
import { ErrorHandlerService } from '@services/error-handler.service';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { HeadersWithToken } from '@services/headers-with-token.service';
import { HelperService } from '@services/helper.service';
import { ImageService } from '@services/image.service';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PusherService } from '@services/pusher.service';
import { SeasonService } from '@services/season.service';
import { SharedModule } from '../shared/shared.module';
import { throwIfAlreadyLoaded } from './module-import-guard';
import { TeamPredictionService } from '@services/team/team-prediction.service';
import { TeamRatingService } from '@services/team/team-rating.service';
import { TeamMatchService } from '@services/team/team-match.service';
import { TeamParticipantService } from '@services/team/team-participant.service';
import { TeamRatingUserService } from '@services/team/team-rating-user.service';
import { TeamService } from '@services/team/team.service';
import { TeamTeamMatchService } from '@services/team/team-team-match.service';
import { TournamentService } from '@services/tournament.service';
import { TitleService } from '@services/title.service';
import { UserService } from '@services/user.service';
import { FormValidatorService } from '@services/form-validator.service';

@NgModule({
    imports: [CommonModule, ReactiveFormsModule, RouterModule, SharedModule],
    exports: [AccessDeniedComponent, FooterComponent, HeaderComponent, PageNotFoundComponent],
    declarations: [AccessDeniedComponent, FooterComponent, HeaderComponent, PageNotFoundComponent],
    providers: [
        AuthService,
        ClubService,
        ChampionshipMatchService,
        ChampionshipPredictionService,
        ChampionshipRatingService,
        CompetitionService,
        ConfirmModalService,
        CupCupMatchService,
        CupMatchService,
        CupPredictionService,
        CupStageService,
        CupStageTypeService,
        CurrentStateService,
        ErrorHandlerService,
        HeadersWithToken,
        HelperService,
        ImageService,
        PusherService,
        SeasonService,
        TeamMatchService,
        TeamParticipantService,
        TeamPredictionService,
        TeamRatingService,
        TeamRatingUserService,
        TeamService,
        TeamTeamMatchService,
        TitleService,
        TournamentService,
        UserService,
        FormValidatorService
    ]
})
export class CoreModule {
    constructor(
        @Optional()
        @SkipSelf()
        parentModule: CoreModule
    ) {
        throwIfAlreadyLoaded(parentModule, 'CoreModule');
    }
}
