import { Sequence } from '@enums/sequence.enum';

export class UserSearch {
   public limit: number;
   public name?: string;
   public orderBy?: string;
   public sequence?: Sequence;
}
