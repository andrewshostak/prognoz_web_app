import { Sequence } from '@enums/sequence.enum';

export class ClubSearch {
   public limit: number;
   public orderBy?: string;
   public page: number;
   public sequence?: Sequence;
   public parentId?: number;
   public search?: string;
   public relations?: string[];
   public type?: 'national_teams' | 'clubs';
}
