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
import { ChampionshipRatingService } from '@services/api/v2/championship/championship-rating.service';
import { ChampionshipCompetitionService } from '@services/championship-competition.service';
import { CupApplicationService } from '@services/api/v2/cup/cup-application.service';
import { CupGroupNumberService } from '@services/api/v2/cup/cup-group-number.service';
import { CupRatingService } from '@services/api/v2/cup/cup-rating.service';
import { CurrentStateService } from '@services/current-state.service';
import { DeviceService } from '@services/device.service';
import { FormValidatorService } from '@services/form-validator.service';
import { AuthService } from '@services/api/v2/auth.service';
import { ChampionshipMatchService } from '@services/api/v2/championship/championship-match.service';
import { ChampionshipPredictionService } from '@services/api/v2/championship/championship-prediction.service';
import { ClubService } from '@services/api/v2/club.service';
import { CompetitionService } from '@services/api/v2/competition.service';
import { CupCompetitionService } from '@services/cup-competition.service';
import { CupCupMatchService } from '@services/api/v2/cup/cup-cup-match.service';
import { CupMatchService } from '@services/api/v2/cup/cup-match.service';
import { CupPredictionService } from '@services/api/v2/cup/cup-prediction.service';
import { CupRatingGroupTableComponent } from '@app/cup/cup-rating-group-table/cup-rating-group-table.component';
import { CupStageService } from '@services/api/v2/cup/cup-stage.service';
import { CupStageTypeService } from '@services/api/v2/cup/cup-stage-type.service';
import { HeaderImageService } from '@services/header-image.service';
import { MatchService } from '@services/api/v2/match.service';
import { NewsService } from '@services/api/v2/news.service';
import { SeasonService } from '@services/api/v2/season.service';
import { TeamCompetitionService } from '@services/team-competition.service';
import { TeamMatchService } from '@services/api/v2/team/team-match.service';
import { TeamMatchService as TeamMatchV1Service } from '@services/api/v1/team-match.service';
import { TeamService } from '@services/api/v2/team/team.service';
import { TeamParticipantService } from '@services/api/v2/team/team-participant.service';
import { UserService } from '@services/api/v2/user.service';
import { PaginationService } from '@services/pagination.service';
import { PusherService } from '@services/pusher.service';
import { SettingsService } from '@services/settings.service';
import { TeamPredictionService } from '@services/api/v2/team/team-prediction.service';
import { TeamPredictionService as TeamPredictionV1Service } from '@services/api/v1/team-prediction.service';
import { TeamRatingUserService } from '@services/api/v2/team/team-rating-user.service';
import { TeamRatingService } from '@services/api/v2/team/team-rating.service';
import { TeamStageService } from '@services/api/v2/team/team-stage.service';
import { TeamStageTypeService } from '@services/api/v2/team/team-stage-type.service';
import { TeamTeamMatchService } from '@services/api/v2/team/team-team-match.service';
import { TitleService } from '@services/title.service';
import { TournamentService } from '@services/api/v2/tournament.service';
import { UtilsService } from '@services/utils.service';

@NgModule({
   declarations: [AccessDeniedComponent, CupRatingGroupTableComponent, FooterComponent, HeaderComponent, PageNotFoundComponent],
   exports: [AccessDeniedComponent, CupRatingGroupTableComponent, FooterComponent, HeaderComponent, PageNotFoundComponent],
   providers: [
      AuthService,
      AuthGuard,
      ChampionshipCompetitionService,
      ChampionshipMatchService,
      ChampionshipPredictionService,
      ChampionshipRatingService,
      ClubService,
      CompetitionService,
      CupApplicationService,
      CupCompetitionService,
      CupCupMatchService,
      CupGroupNumberService,
      CupMatchService,
      CupPredictionService,
      CupRatingService,
      CupStageService,
      CupStageTypeService,
      CurrentStateService,
      DeviceService,
      FormValidatorService,
      HeaderImageService,
      MatchService,
      NewsService,
      PaginationService,
      PusherService,
      SeasonService,
      SettingsService,
      TeamCompetitionService,
      TeamMatchV1Service,
      TeamMatchService,
      TeamService,
      TeamParticipantService,
      TeamPredictionV1Service,
      TeamPredictionService,
      TeamRatingService,
      TeamRatingUserService,
      TeamStageService,
      TeamStageTypeService,
      TeamTeamMatchService,
      TitleService,
      TournamentService,
      UserService,
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
