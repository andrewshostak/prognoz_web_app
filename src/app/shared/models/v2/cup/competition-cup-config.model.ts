export class CompetitionCupConfig {
   is_friendly?: boolean;
   group?: {
      promotion?: number[];
      possible_promotion?: number[];
      other_competition?: number[];
      number_of_participants: number[];
   }
   playoff?: {
      number_of_participants: number
   }
   number_of_group_stage_participants?: number
}
