import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { MatchTableComponent } from '@app/manage/manage-match/match-table/match-table.component';
import { Sequence } from '@enums/sequence.enum';
import { ActivatedRouteMock } from '@mocks/activated-route.mock';
import { NgbModalMock } from '@mocks/ngb-modal.mock';
import { MatchServiceMock } from '@mocks/services/match.service.mock';
import { NotificationsServiceMock } from '@mocks/services/notifications.service.mock';
import { Match } from '@models/v2/match.model';
import { OpenedModal } from '@models/opened-modal.model';
import { PaginatedResponse } from '@models/paginated-response.model';
import { Pagination } from '@models/pagination.model';
import { MatchSearch } from '@models/search/match-search.model';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MatchService } from '@services/api/v2/match.service';
import { PaginationService } from '@services/pagination.service';
import { SettingsService } from '@services/settings.service';
import { NotificationsService } from 'angular2-notifications';
import { of } from 'rxjs';

describe('MatchTableComponent', () => {
   let matchTableComponent: MatchTableComponent;
   let matchService: MatchServiceMock;
   let activatedRoute: ActivatedRouteMock;
   let ngbModalService: NgbModalMock;
   let notificationsService: NotificationsServiceMock;

   beforeEach(() => {
      TestBed.configureTestingModule({
         providers: [
            MatchTableComponent,
            { provide: MatchService, useClass: MatchServiceMock },
            { provide: ActivatedRoute, useClass: ActivatedRouteMock },
            { provide: NgbModal, useClass: NgbModalMock },
            { provide: NotificationsService, useClass: NotificationsServiceMock }
         ]
      });

      matchTableComponent = TestBed.get(MatchTableComponent);
      matchService = TestBed.get(MatchService);
      activatedRoute = TestBed.get(ActivatedRoute);
      ngbModalService = TestBed.get(NgbModal);
      notificationsService = TestBed.get(NotificationsService);
   });

   it('should not have any activatedRouteSubscription value', () => {
      expect(matchTableComponent.activatedRouteSubscription).toBeUndefined();
   });

   it('should not have any clubImagesUrl value', () => {
      expect(matchTableComponent.clubsLogosPath).toBeUndefined();
   });

   it('should not have any matches value', () => {
      expect(matchTableComponent.matches).toBeUndefined();
   });

   it('should not have any openedModal value', () => {
      expect(matchTableComponent.openedModal).toBeUndefined();
   });

   it('should not have any paginationData value', () => {
      expect(matchTableComponent.paginationData).toBeUndefined();
   });

   describe('#deleteMatch', () => {
      let matches;

      beforeEach(() => {
         matches = [{ id: 123 }, { id: 456, club_home: { title: 'Dynamo' }, club_away: { title: 'Shakhtar' } }, { id: 789 }] as Match[];

         matchTableComponent.matches = Object.assign({}, matches);
         matchTableComponent.openedModal = {
            data: matches[1],
            reference: ngbModalService.open()
         } as OpenedModal<Match>;
         matchTableComponent.paginationData = { total: matches.length } as Pagination;

         spyOn(matchService, 'deleteMatch').and.callThrough();
      });

      it('should call deleteMatch from matchService', () => {
         matchTableComponent.deleteMatch();
         expect(matchService.deleteMatch).toHaveBeenCalledWith(matches[1].id);
      });

      it('should remove deleted match from the list if update was successful', () => {
         matchTableComponent.deleteMatch();
         expect(matchTableComponent.matches).not.toContain(matches[1]);
      });

      it('should decrease total number if update was successful', () => {
         matchTableComponent.deleteMatch();
         expect(matchTableComponent.paginationData.total).toEqual(matches.length - 1);
      });

      it('should call success from notificationsService', () => {
         spyOn(notificationsService, 'success');
         matchTableComponent.deleteMatch();
         expect(notificationsService.success).toHaveBeenCalledWith(
            'Успішно',
            `Матч №${matchTableComponent.openedModal.data.id} ${matchTableComponent.openedModal.data.club_home.title} - ${matchTableComponent.openedModal.data.club_away.title} видалено`
         );
      });

      it('should call close from openedModal', () => {
         spyOn(matchTableComponent.openedModal.reference, 'close');
         matchTableComponent.deleteMatch();
         expect(matchTableComponent.openedModal.reference.close).toHaveBeenCalledTimes(1);
      });
   });

   describe('#getMatchesData', () => {
      it('should call getMatches from matchService', () => {
         spyOn(matchService, 'getMatches').and.callThrough();
         matchTableComponent.getMatchesData(2);
         const expectedParam: MatchSearch = {
            limit: PaginationService.perPage.matches,
            orderBy: 'state',
            page: 2,
            sequence: Sequence.Ascending
         };

         expect(matchService.getMatches).toHaveBeenCalledWith(expectedParam);
      });

      it('should set matches if response from service is successful', () => {
         spyOn(matchService, 'getMatches').and.callThrough();
         matchTableComponent.getMatchesData(20);

         expect(matchTableComponent.matches).toEqual(matchService.paginatedMatchesResponse.data);
      });

      it('should call getPaginationData if response from service is successful', () => {
         const expectedResponse = { current_page: 22, per_page: 21, total: 2200 } as PaginatedResponse<Match>;
         spyOn(matchService, 'getMatches').and.returnValue(of(expectedResponse));
         spyOn(PaginationService, 'getPaginationData');
         matchTableComponent.getMatchesData(19);

         expect(PaginationService.getPaginationData).toHaveBeenCalledWith(expectedResponse, '/manage/matches/page/');
      });

      it('should set paginationData if response is successful', () => {
         const expectedPaginationData: Pagination = {
            currentPage: 22,
            pageSize: 21,
            path: '/manage/matches/page',
            total: 2200
         };

         spyOn(matchService, 'getMatches').and.callThrough();
         spyOn(PaginationService, 'getPaginationData').and.returnValue(expectedPaginationData);

         matchTableComponent.getMatchesData(19);
         expect(matchTableComponent.paginationData).toEqual(expectedPaginationData);
      });
   });

   describe('#ngOnDestroy', () => {
      it('should call unsubscribe from activatedRoute', () => {
         matchTableComponent.ngOnInit();
         spyOn(matchTableComponent.activatedRouteSubscription, 'unsubscribe');

         matchTableComponent.ngOnDestroy();
         expect(matchTableComponent.activatedRouteSubscription.unsubscribe).toHaveBeenCalledTimes(1);
      });
   });

   describe('#ngOnInit', () => {
      it('should set clubsLogosPath', () => {
         matchTableComponent.ngOnInit();
         expect(matchTableComponent.clubsLogosPath).toEqual(SettingsService.imageBaseUrl.clubs);
      });

      it('should set activatedRouteSubscription', () => {
         matchTableComponent.ngOnInit();
         expect(matchTableComponent.activatedRouteSubscription).toBeDefined();
      });

      it('should call getMatchesData with appropriate param', () => {
         TestBed.get(ActivatedRoute).params = of({ pageNumber: 823 });
         spyOn(matchTableComponent, 'getMatchesData');
         matchTableComponent.ngOnInit();

         expect(matchTableComponent.getMatchesData).toHaveBeenCalledWith(823);
      });
   });

   describe('#openConfirmModal', () => {
      it('should set openedModal', () => {
         spyOn(ngbModalService, 'open').and.callThrough();
         matchTableComponent.openConfirmModal(ngbModalService.reference.componentInstance, { id: 422 } as Match, () => {});

         expect(ngbModalService.open).toHaveBeenCalledWith(ngbModalService.reference.componentInstance, { centered: true });
         expect(matchTableComponent.openedModal.reference).toEqual(ngbModalService.reference as NgbModalRef);
         expect(matchTableComponent.openedModal.data).toEqual({ id: 422 } as Match);
         expect(matchTableComponent.openedModal.submitted).not.toBeNull();
      });
   });
});
