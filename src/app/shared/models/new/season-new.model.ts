/* tslint:disable:variable-name */
import { ModelStatus } from '@enums/model-status.enum';

export class SeasonNew {
   public active: ModelStatus;
   public created_at: string;
   public ended: ModelStatus;
   public id: number;
   public title: string;
   public updated_at: string;
}
