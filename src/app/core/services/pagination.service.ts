import { Injectable } from '@angular/core';
import { PaginatedResponse } from '@models/paginated-response.model';
import { Pagination } from '@models/pagination.model';

@Injectable()
export class PaginationService {
   public static readonly perPage: { [key: string]: number } = {
      championshipMatches: 10,
      competitions: 10,
      clubs: 10,
      cupMatches: 16,
      cupCupMatches: 10,
      cupStages: 10,
      guestbookMessages: 15,
      matches: 12,
      news: 9,
      teamMatches: 12,
      teamTeamMatches: 10,
      teams: 10,
      teamParticipants: 10,
      teamsStages: 10
   };

   public static limit: { [key: string]: number } = {
      championshipMatches: 100,
      championshipPredictions: 150,
      championshipRating: 200,

      cupCupMatches: 48,
      cupMatches: 24,
      cupStages: 36,
      cupApplications: 192,

      teamMatches: 24,
      teamParticipants: 10,
      teamPredictions: 24,
      teamStages: 30,
      teamTeamMatches: 16,
      teamTeams: 42,
      teamRatingItems: 32,
      teamRatingUsers: 128,

      clubs: 10,
      competitions: 16,
      comments: 40,
      matches: 32,
      seasons: 20,
      users: 10
   };

   public static getOffset(pageNumber: number, itemsPerPage: number): number {
      return pageNumber * itemsPerPage - itemsPerPage;
   }

   public static getPaginationData<T>(paginatedResponse: PaginatedResponse<T>, path: string): Pagination {
      return {
         currentPage: paginatedResponse.current_page,
         pageSize: paginatedResponse.per_page,
         path,
         total: paginatedResponse.total
      };
   }
}
