/* tslint:disable:variable-name */
export class CupApplication {
   id: number;
   competition_id: number;
   applicant_id: number;
   receiver_id: number;
   place: number;
   confirmed_at: string;
   refused_at: string;
   ended: boolean;
   created_at: string;
   updated_at: string;
   applicant: {
      name: string;
      image: string;
   };
   receiver: {
      name: string;
      image: string;
   };
   competition: {
      id: number;
      tournament_id: number;
      season_id: number;
      title: string;
      stated: boolean;
      active: boolean;
      ended: boolean;
      participants: number;
      players_in_group: number;
      first_playoff_stage: number;
      number_in_season: number;
      active_round: number;
      winners: any[];
      number_of_teams: number;
      cup_applications: any[];
      state: any;
   };
}
