/* tslint:disable:variable-name */
export class PaginatedResponse<T> {
   public current_page: number;
   public data: T[];
   public from: number;
   public last_page: number;
   public next_page_url: string;
   public per_page: number;
   public prev_page_url: string;
   public to: number;
   public total: number;
}
