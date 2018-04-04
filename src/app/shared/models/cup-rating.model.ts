export class CupRating {
    user_id:    number;
    win:        number;
    draw:       number;
    loss:       number;
    scored:     number;
    missed:     number;
    active_season_points: number;
    previous_season_points: number;
    before_previous_season_points: number;
    points_summary: number;
    user: {
        name: string,
        hometown: string,
        main_club: {
            image: string,
            title: string
        }
    };
}
