export class CupRatingGroup {
    user_id: number;
    user: {
        name: string;
        image: string;
        hometown: string;
    };
    points: number;
    win: number;
    draw: number;
    loss: number;
    scored: number;
    missed: number;
    points_sum: number;
    dc_sum: number;
}
