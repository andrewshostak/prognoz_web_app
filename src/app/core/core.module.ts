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

import { AuthService } from '@services/auth.service';
import { ChampionshipMatchService } from '@services/championship/championship-match.service';
import { ChampionshipPredictionService } from '@services/championship/championship-prediction.service';
import { ChampionshipRatingService } from '@services/championship/championship-rating.service';
import { ChampionshipService } from '@services/championship/championship.service';
import { ClubService } from '@services/club.service';
import { CompetitionService } from '@services/competition.service';
import { CupApplicationService } from '@services/cup/cup-application.service';
import { CupCupMatchService } from '@services/cup/cup-cup-match.service';
import { CupMatchService } from '@services/cup/cup-match.service';
import { CupPredictionService } from '@services/cup/cup-prediction.service';
import { CupRatingService } from '@services/cup/cup-rating.service';
import { CupStageTypeService } from '@services/cup/cup-stage-type.service';
import { CupStageService } from '@services/cup/cup-stage.service';
import { CurrentStateService } from '@services/current-state.service';
import { ErrorHandlerService } from '@services/error-handler.service';
import { FormValidatorService } from '@services/form-validator.service';
import { HeadersWithToken } from '@services/headers-with-token.service';
import { ImageService } from '@services/image.service';
import { ChampionshipMatchNewService } from '@services/new/championship-match-new.service';
import { ChampionshipPredictionNewService } from '@services/new/championship-prediction-new.service';
import { CompetitionNewService } from '@services/new/competition-new.service';
import { CupMatchNewService } from '@services/new/cup-match-new.service';
import { MatchService } from '@services/new/match.service';
import { TeamMatchNewService } from '@services/new/team-match-new.service';
import { PaginationService } from '@services/pagination.service';
import { PusherService } from '@services/pusher.service';
import { SeasonService } from '@services/season.service';
import { SettingsService } from '@services/settings.service';
import { TeamMatchService } from '@services/team/team-match.service';
import { TeamParticipantService } from '@services/team/team-participant.service';
import { TeamPredictionService } from '@services/team/team-prediction.service';
import { TeamRatingUserService } from '@services/team/team-rating-user.service';
import { TeamRatingService } from '@services/team/team-rating.service';
import { TeamTeamMatchService } from '@services/team/team-team-match.service';
import { TeamService } from '@services/team/team.service';
import { TitleService } from '@services/title.service';
import { TournamentService } from '@services/tournament.service';
import { UserService } from '@services/user.service';
import { UtilsService } from '@services/utils.service';

@NgModule({
   declarations: [AccessDeniedComponent, FooterComponent, HeaderComponent, PageNotFoundComponent],
   exports: [AccessDeniedComponent, FooterComponent, HeaderComponent, PageNotFoundComponent],
   imports: [CommonModule, ReactiveFormsModule, RouterModule, SharedModule],
   providers: [
      AuthService,
      ClubService,
      ChampionshipService,
      ChampionshipMatchService,
      ChampionshipMatchNewService,
      ChampionshipPredictionNewService,
      ChampionshipPredictionService,
      ChampionshipRatingService,
      CompetitionService,
      CompetitionNewService,
      CupApplicationService,
      CupCupMatchService,
      CupMatchNewService,
      CupMatchService,
      CupPredictionService,
      CupRatingService,
      CupStageService,
      CupStageTypeService,
      CurrentStateService,
      ErrorHandlerService,
      FormValidatorService,
      HeadersWithToken,
      ImageService,
      MatchService,
      PaginationService,
      PusherService,
      SeasonService,
      SettingsService,
      TeamMatchNewService,
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
      UtilsService
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
