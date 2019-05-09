import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { MatchTableComponent } from '@app/manage/manage-match/match-table/match-table.component';
import { ActivatedRouteMock } from '@mocks/activated-route.mock';
import { MatchServiceMock } from '@mocks/services/match.service.mock';
import { Match } from '@models/match.model';
import { PaginatedResponse } from '@models/paginated-response.model';
import { Pagination } from '@models/pagination.model';
import { MatchSearch } from '@models/search/match-search.model';
import { MatchService } from '@services/match.service';
import { PaginationService } from '@services/pagination.service';
import { SettingsService } from '@services/settings.service';
import { of } from 'rxjs';

describe('MatchTableComponent', () => {
   let matchTableComponent: MatchTableComponent;
   let matchService: MatchServiceMock;
   let activatedRoute: ActivatedRouteMock;

   beforeEach(() => {
      TestBed.configureTestingModule({
         providers: [
            MatchTableComponent,
            { provide: MatchService, useClass: MatchServiceMock },
            { provide: ActivatedRoute, useClass: ActivatedRouteMock }
         ]
      });

      matchTableComponent = TestBed.get(MatchTableComponent);
      matchService = TestBed.get(MatchService);
      activatedRoute = TestBed.get(ActivatedRoute);
   });

   it('should not have any activatedRouteSubscription value', () => {
      expect(matchTableComponent.activatedRouteSubscription).toBeUndefined();
   });

   it('should not have any matches value', () => {
      expect(matchTableComponent.matches).toBeUndefined();
   });

   it('should not have any paginationData value', () => {
      expect(matchTableComponent.paginationData).toBeUndefined();
   });

   describe('#getMatchesData', () => {
      it('should call getMatches from matchService', () => {
         spyOn(matchService, 'getMatches').and.callThrough();
         spyOn(PaginationService, 'getOffset').and.returnValue(14);
         matchTableComponent.getMatchesData(2);
         const expectedParam: MatchSearch = { limit: SettingsService.matchesPerPage, offset: 14 };

         expect(PaginationService.getOffset).toHaveBeenCalledWith(2, SettingsService.matchesPerPage);
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
});
