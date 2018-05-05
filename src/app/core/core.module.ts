import { CommonModule }                 from '@angular/common';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { ReactiveFormsModule }          from '@angular/forms';
import { RouterModule }                 from '@angular/router';

import { AccessDeniedComponent }  from './access-denied/access-denied.component';
import { AuthService }            from './auth.service';
import { ClubService }            from './club.service';
import { CompetitionService }     from './competition.service';
import { ConfirmModalService }    from './confirm-modal.service';
import { CupCupMatchService }     from './services/cup/cup-cup-match.service';
import { CupMatchService }        from './services/cup/cup-match.service';
import { CupStageTypeService }    from './services/cup/cup-stage-type.service';
import { CurrentStateService }    from './current-state.service';
import { ErrorHandlerService }    from './error-handler.service';
import { FooterComponent }        from './footer/footer.component';
import { HeaderComponent }        from './header/header.component';
import { HeadersWithToken }       from './headers-with-token.service';
import { HelperService }          from './helper.service';
import { ImageService }           from './image.service';
import { PageNotFoundComponent }  from './page-not-found/page-not-found.component';
import { PusherService }          from './pusher.service';
import { SeasonService }          from './season.service';
import { SharedModule }           from '../shared/shared.module';
import { throwIfAlreadyLoaded }   from './module-import-guard';
import { TournamentService }      from './tournament.service';
import { TitleService }           from './title.service';
import { UserService }            from './user.service';
import { ValidatorService }       from './services/validator.service';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule,
        SharedModule,
    ],
    exports: [
        AccessDeniedComponent,
        FooterComponent,
        HeaderComponent,
        PageNotFoundComponent,
    ],
    declarations: [
        AccessDeniedComponent,
        FooterComponent,
        HeaderComponent,
        PageNotFoundComponent
    ],
    providers: [
        AuthService,
        ClubService,
        CompetitionService,
        ConfirmModalService,
        CupCupMatchService,
        CupMatchService,
        CupStageTypeService,
        CurrentStateService,
        ErrorHandlerService,
        HeadersWithToken,
        HelperService,
        ImageService,
        PusherService,
        SeasonService,
        TitleService,
        TournamentService,
        UserService,
        ValidatorService
    ],
})
export class CoreModule {
    constructor( @Optional() @SkipSelf() parentModule: CoreModule) {
        throwIfAlreadyLoaded(parentModule, 'CoreModule');
    }
}
