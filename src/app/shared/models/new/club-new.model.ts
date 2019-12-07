/* tslint:disable:variable-name */
export class ClubNew {
   public id: number;
   public parent_id: number;
   public title: string;
   public link: string;
   public image: string;

   public pivot?: {
      main: boolean;
   };
}
