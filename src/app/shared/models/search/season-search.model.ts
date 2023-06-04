import { SeasonState } from '@enums/season-state.enum';
import { Sequence } from '@enums/sequence.enum';

export class SeasonSearch {
   limit: number;
   orderBy?: string;
   page: number;
   sequence?: Sequence;
   states?: SeasonState[];
}
