/* tslint:disable:variable-name */
export class Club {
   id: number;
   parent_id: number;
   title: string;
   link: string;
   image: string;
   created_at: string;
   updated_at: string;

   parent?: Club;
   pivot?: {
      main: boolean;
   };
}
