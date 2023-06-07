import { Sequence } from '@enums/sequence.enum';

export class TeamPredictionSearch {
   limit: number;
   orderBy?: string;
   page: number;
   relations?: string[];
   sequence?: Sequence;
   teamIds?: number[];
   teamMatchIds?: number[];
}
