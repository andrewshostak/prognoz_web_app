import { Match } from '@models/v2/match.model';
import { PaginatedResponse } from '@models/paginated-response.model';
import { MatchSearch } from '@models/search/match-search.model';
import { Observable, of } from 'rxjs';

export class MatchServiceMock {
   public readonly paginatedMatchesResponse: PaginatedResponse<Match> = {
      current_page: 2,
      data: [{ id: 1, home_club_id: 24 }, { id: 2 }, { id: 3 }],
      per_page: 10,
      total: 21
   } as PaginatedResponse<Match>;

   public deleteMatch(id: number): Observable<void> {
      return of(null);
   }

   public getMatches(matchSearch: MatchSearch): Observable<PaginatedResponse<Match>> {
      return of(this.paginatedMatchesResponse);
   }
}
