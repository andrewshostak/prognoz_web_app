/* tslint:disable:variable-name */
/**
 * @deprecated
 */
export class Comment {
   id: number;
   body: string;
   news_id: number;
   user_id: number;
   created_at: string;
   updated_at: string;
   user: {
      name: string;
      image: string;
      hometown: string;
      clubs: {
         image: string;
      }[];
      winners: {
         award: {
            title: string;
         };
         competition: {
            title: string;
         };
      }[];
   };
}
