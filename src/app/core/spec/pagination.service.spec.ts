import { PaginatedResponse } from '@models/paginated-response.model';
import { Pagination } from '@models/pagination.model';
import { PaginationService } from '@services/pagination.service';

describe('PaginationService', () => {
   describe('#getOffset', () => {
      const offsetValues: Array<{ pageNumber: number; itemsPerPage: number }> = [
         { pageNumber: 1, itemsPerPage: 10 },
         { pageNumber: 1, itemsPerPage: 20 },
         { pageNumber: 1, itemsPerPage: 50 },
         { pageNumber: 25, itemsPerPage: 10 },
         { pageNumber: 99, itemsPerPage: 12 },
         { pageNumber: 1345, itemsPerPage: 5 },
         { pageNumber: 2, itemsPerPage: 10 },
         { pageNumber: 2, itemsPerPage: 20 },
         { pageNumber: 2, itemsPerPage: 33 }
      ];

      it('should return 0 if it is first page', () => {
         offsetValues.slice(0, 3).forEach(value => {
            expect(PaginationService.getOffset(value.pageNumber, value.itemsPerPage)).toEqual(0);
         });
      });

      it('should return same value as second parameter if it is second page', () => {
         offsetValues.slice(-3).forEach(value => {
            expect(PaginationService.getOffset(value.pageNumber, value.itemsPerPage)).toEqual(value.itemsPerPage);
         });
      });

      it('should return right offset', () => {
         const expectedValues: number[] = [0, 0, 0, 240, 1176, 6720, 10, 20, 33];
         offsetValues.forEach((value, index) => {
            expect(PaginationService.getOffset(value.pageNumber, value.itemsPerPage)).toEqual(expectedValues[index]);
         });
      });
   });

   describe('#getPaginationData', () => {
      it('should map PaginatedResponse to Pagination type', () => {
         const paginatedResponse: PaginatedResponse<string> = {
            current_page: 2,
            next_page_url: 'lalalei',
            per_page: 41,
            total: 124
         } as PaginatedResponse<string>;
         const path: string = 'items';
         const expected: Pagination = {
            currentPage: 2,
            pageSize: 41,
            path,
            total: 124
         };
         expect(PaginationService.getPaginationData(paginatedResponse, path)).toEqual(expected);
      });
   });
});
