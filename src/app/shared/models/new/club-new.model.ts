/* tslint:disable:variable-name */
export class ClubNew {
   public id: number;
   public parent_id: number;
   public title: string;
   public link: string;
   public image: string;
   public created_at: string;
   public updated_at: string;

   public parent?: ClubNew;
   public pivot?: {
      main: boolean;
   };
}
