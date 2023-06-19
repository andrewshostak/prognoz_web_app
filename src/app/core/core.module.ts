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
import { AwardNewService } from '@services/v2/award-new.service';
import { ChampionshipRatingNewService } from '@services/v2/championship-rating-new.service';
import { ChampionshipService } from '@services/championship/championship.service';
import { CupApplicationNewService } from '@services/v2/cup-application-new.service';
import { CupGroupNumberNewService } from '@services/v2/cup-group-number-new.service';
import { CupRatingNewService } from '@services/v2/cup-rating-new.service';
import { CurrentStateService } from '@services/current-state.service';
import { DeviceService } from '@services/device.service';
import { FormValidatorService } from '@services/form-validator.service';
import { AuthNewService } from '@services/v2/auth-new.service';
import { ChampionshipMatchNewService } from '@services/v2/championship-match-new.service';
import { ChampionshipPredictionNewService } from '@services/v2/championship-prediction-new.service';
import { ClubNewService } from '@services/v2/club-new.service';
import { CompetitionNewService } from '@services/v2/competition-new.service';
import { CupCupMatchNewService } from '@services/v2/cup-cup-match-new.service';
import { CupMatchNewService } from '@services/v2/cup-match-new.service';
import { CupPredictionNewService } from '@services/v2/cup-prediction-new.service';
import { CupStageNewService } from '@services/v2/cup-stage-new.service';
import { CupStageTypeNewService } from '@services/v2/cup-stage-type-new.service';
import { HeaderImageService } from '@services/v2/header-image.service';
import { MatchService } from '@services/v2/match.service';
import { NewsNewService } from '@services/v2/news-new.service';
import { SeasonNewService } from '@services/v2/season-new.service';
import { TeamCompetitionNewService } from '@services/v2/team-competition-new.service';
import { TeamMatchNewService } from '@services/v2/team-match-new.service';
import { TeamNewService } from '@services/v2/team-new.service';
import { TeamParticipantNewService } from '@services/v2/team-participant-new.service';
import { UserNewService } from '@services/v2/user-new.service';
import { PaginationService } from '@services/pagination.service';
import { PusherService } from '@services/pusher.service';
import { SettingsService } from '@services/settings.service';
import { TeamMatchService } from '@services/team/team-match.service';
import { TeamPredictionNewService } from '@services/v2/team-prediction-new.service';
import { TeamPredictionService } from '@services/team/team-prediction.service';
import { TeamRatingUserNewService } from '@services/v2/team-rating-user-new.service';
import { TeamRatingNewService } from '@services/v2/team-rating-new.service';
import { TeamStageNewService } from '@services/v2/team-stage-new.service';
import { TeamStageTypeNewService } from '@services/v2/team-stage-type-new.service';
import { TeamTeamMatchNewService } from '@services/v2/team-team-match-new.service';
import { TitleService } from '@services/title.service';
import { TournamentNewService } from '@services/v2/tournament-new.service';
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
      FormValidatorService,
      HeaderImageService,
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
