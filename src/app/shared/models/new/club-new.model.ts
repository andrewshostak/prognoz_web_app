/* tslint:disable:variable-name */
export class ClubNew {
   id: number;
   parent_id: number;
   title: string;
   link: string;
   image: string;
   created_at: string;
   updated_at: string;

   parent?: ClubNew;
   pivot?: {
      main: boolean;
   };
}
