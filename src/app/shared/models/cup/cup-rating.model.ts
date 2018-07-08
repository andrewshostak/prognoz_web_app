export class CupRating {
    user_id: number;
    win: number;
    draw: number;
    loss: number;
    scored: number;
    missed: number;
    points: number;
    coefficient: number;
    active_season_points: number;
    previous_season_points: number;
    before_previous_season_points: number;
    points_summary: number;
    active_coefficient: number;
    previous_coefficient: number;
    before_previous_coefficient: number;
    active_season: any;
    previous_season: any;
    before_previous_season: any;
    user: {
        name: string;
        hometown: string;
        image: string;
        main_club: {
            image: string;
            title: string;
        }[];
        clubs: {
            image: string;
            title: string;
        };
    };
    season: {
        title: string;
    };
}
