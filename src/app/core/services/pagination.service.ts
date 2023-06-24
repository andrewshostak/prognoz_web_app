import { Injectable } from '@angular/core';
import { PaginatedResponse } from '@models/paginated-response.model';
import { Pagination } from '@models/pagination.model';

@Injectable()
export class PaginationService {
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
