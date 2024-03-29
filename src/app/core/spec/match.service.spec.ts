import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { Sequence } from '@enums/sequence.enum';
import { environment } from '@env';
import { Match } from '@models/v2/match.model';
import { PaginatedResponse } from '@models/paginated-response.model';
import { MatchSearch } from '@models/search/match-search.model';
import { MatchService } from '@services/api/v2/match.service';

describe('MatchService', () => {
   let matchService: MatchService;
   let httpTestingController: HttpTestingController;

   beforeEach(() => {
      TestBed.configureTestingModule({
         imports: [HttpClientTestingModule],
         providers: [MatchService]
      });

      matchService = TestBed.inject(MatchService);
      httpTestingController = TestBed.inject(HttpTestingController);
   });

   it('should have matchesUrl', () => {
      expect(matchService.matchesUrl).toEqual(`${environment.apiBaseUrl}/v2/matches`);
   });

   describe('#deleteMatches', () => {
      it('should use DELETE method', () => {
         matchService.deleteMatch(200).subscribe(() => {
            return;
         });

         const testRequest = httpTestingController.expectOne(matchService.matchesUrl + '/200');
         expect(testRequest.request.method).toEqual('DELETE');
         testRequest.flush(null);
         httpTestingController.verify();
      });
   });

   describe('#getMatches', () => {
      let someMatchesData: PaginatedResponse<Match>;
      beforeAll(() => {
         someMatchesData = { total: 10, data: [{ id: 1 }, { id: 2 }] } as PaginatedResponse<Match>;
      });

      it('should set request params', () => {
         const matchSearch: MatchSearch = { limit: 10, page: 31, sequence: Sequence.Ascending, orderBy: 'started_at' };
         matchService.getMatches(matchSearch).subscribe(() => {
            return;
         });

         const testRequest = httpTestingController.expectOne(
            `${matchService.matchesUrl}?limit=${matchSearch.limit.toString()}&page=${matchSearch.page.toString()}&order_by=${
               matchSearch.orderBy
            }&sequence=${matchSearch.sequence}`
         );
         expect(testRequest.request.url).toEqual(`${matchService.matchesUrl}`);
         testRequest.flush(someMatchesData);
      });

      it('should use GET method', () => {
         matchService.getMatches({} as MatchSearch).subscribe(() => {
            return;
         });

         const testRequest = httpTestingController.expectOne(matchService.matchesUrl);
         expect(testRequest.request.method).toEqual('GET');
         testRequest.flush(someMatchesData);
      });

      it('should return an Observable<PaginatedResponse<Match>>', () => {
         matchService.getMatches({} as MatchSearch).subscribe(response => {
            expect(response as PaginatedResponse<Match>).toEqual(someMatchesData);
         });

         const testRequest = httpTestingController.expectOne(matchService.matchesUrl);
         testRequest.flush(someMatchesData);
      });

      afterEach(() => {
         httpTestingController.verify();
      });
   });
});
