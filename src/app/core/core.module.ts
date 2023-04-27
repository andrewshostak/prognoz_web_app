import { CommonModule } from '@angular/common';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AccessDeniedComponent } from '@app/core/access-denied/access-denied.component';
import { FooterComponent } from '@app/core/footer/footer.component';
import { HeaderComponent } from '@app/core/header/header.component';
import { throwIfAlreadyLoaded } from '@app/core/module-import-guard';
import { PageNotFoundComponent } from '@app/core/page-not-found/page-not-found.component';
import { SharedModule } from '@app/shared/shared.module';

import { AuthGuard } from '@app/core/guards/auth.guard.service';
import { AwardNewService } from '@services/new/award-new.service';
import { ChampionshipRatingNewService } from '@services/new/championship-rating-new.service';
import { ChampionshipService } from '@services/championship/championship.service';
import { CupApplicationNewService } from '@services/new/cup-application-new.service';
import { CupGroupNumberNewService } from '@services/new/cup-group-number-new.service';
import { CupRatingNewService } from '@services/new/cup-rating-new.service';
import { CurrentStateService } from '@services/current-state.service';
import { DeviceService } from '@services/device.service';
import { ErrorHandlerService } from '@services/error-handler.service';
import { FormValidatorService } from '@services/form-validator.service';
import { HeadersWithToken } from '@services/headers-with-token.service';
import { AuthNewService } from '@services/new/auth-new.service';
import { ChampionshipMatchNewService } from '@services/new/championship-match-new.service';
import { ChampionshipPredictionNewService } from '@services/new/championship-prediction-new.service';
import { ClubNewService } from '@services/new/club-new.service';
import { CompetitionNewService } from '@services/new/competition-new.service';
import { CupCupMatchNewService } from '@services/new/cup-cup-match-new.service';
import { CupMatchNewService } from '@services/new/cup-match-new.service';
import { CupPredictionNewService } from '@services/new/cup-prediction-new.service';
import { CupStageNewService } from '@services/new/cup-stage-new.service';
import { CupStageTypeNewService } from '@services/new/cup-stage-type-new.service';
import { HeaderImageService } from '@services/new/header-image.service';
import { MatchService } from '@services/new/match.service';
import { NewsNewService } from '@services/new/news-new.service';
import { SeasonNewService } from '@services/new/season-new.service';
import { TeamCompetitionNewService } from '@services/new/team-competition-new.service';
import { TeamMatchNewService } from '@services/new/team-match-new.service';
import { TeamNewService } from '@services/new/team-new.service';
import { TeamParticipantNewService } from '@services/new/team-participant-new.service';
import { UserNewService } from '@services/new/user-new.service';
import { PaginationService } from '@services/pagination.service';
import { PusherService } from '@services/pusher.service';
import { SettingsService } from '@services/settings.service';
import { TeamMatchService } from '@services/team/team-match.service';
import { TeamPredictionNewService } from '@services/new/team-prediction-new.service';
import { TeamPredictionService } from '@services/team/team-prediction.service';
import { TeamRatingUserNewService } from '@services/new/team-rating-user-new.service';
import { TeamRatingNewService } from '@services/new/team-rating-new.service';
import { TeamStageNewService } from '@services/new/team-stage-new.service';
import { TeamStageTypeNewService } from '@services/new/team-stage-type-new.service';
import { TeamTeamMatchNewService } from '@services/new/team-team-match-new.service';
import { TitleService } from '@services/title.service';
import { TournamentNewService } from '@services/new/tournament-new.service';
import { UtilsService } from '@services/utils.service';

@NgModule({
   declarations: [AccessDeniedComponent, FooterComponent, HeaderComponent, PageNotFoundComponent],
   exports: [AccessDeniedComponent, FooterComponent, HeaderComponent, PageNotFoundComponent],
   providers: [
      AuthNewService,
      AuthGuard,
      AwardNewService,
      ChampionshipService,
      ChampionshipMatchNewService,
      ChampionshipPredictionNewService,
      ChampionshipRatingNewService,
      ClubNewService,
      CompetitionNewService,
      CupApplicationNewService,
      CupCupMatchNewService,
      CupGroupNumberNewService,
      CupMatchNewService,
      CupPredictionNewService,
      CupRatingNewService,
      CupStageNewService,
      CupStageTypeNewService,
      CurrentStateService,
      DeviceService,
      ErrorHandlerService,
      FormValidatorService,
      HeaderImageService,
      HeadersWithToken,
      MatchService,
      NewsNewService,
      PaginationService,
      PusherService,
      SeasonNewService,
      SettingsService,
      TeamCompetitionNewService,
      TeamMatchNewService,
      TeamMatchService,
      TeamNewService,
      TeamParticipantNewService,
      TeamPredictionNewService,
      TeamPredictionService,
      TeamRatingNewService,
      TeamRatingUserNewService,
      TeamStageNewService,
      TeamStageTypeNewService,
      TeamTeamMatchNewService,
      TitleService,
      TournamentNewService,
      UserNewService,
      UtilsService
   ],
   imports: [CommonModule, ReactiveFormsModule, RouterModule, SharedModule]
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
