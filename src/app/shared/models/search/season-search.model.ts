import { SeasonState } from '@enums/season-state.enum';
import { Sequence } from '@enums/sequence.enum';

export class SeasonSearch {
   public limit: number;
   public orderBy?: string;
   public page: number;
   public sequence?: Sequence;
   public state?: SeasonState;
}
