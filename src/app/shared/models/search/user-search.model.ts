import { Sequence } from '@enums/sequence.enum';

export class UserSearch {
   limit: number;
   name?: string;
   orderBy?: string;
   sequence?: Sequence;
}
