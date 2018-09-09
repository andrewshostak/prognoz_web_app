import { AfterViewInit, Component, Input, ChangeDetectorRef, OnDestroy } from '@angular/core';

import { environment } from '@env';
import { TeamCompetitionService } from '@services/team/team-competition.service';
import { TeamMatch } from '@models/team/team-match.model';
import { TeamMatchService } from '@services/team/team-match.service';
import { TeamTeamMatch } from '@models/team/team-team-match.model';
import { TimePipe } from '../../../shared/pipes/time.pipe';
import { User } from '@models/user.model';
import { UtilsService } from '@services/utils.service';

declare const $: any;

@Component({
    selector: 'app-team-team-match-card',
    templateUrl: './team-team-match-card.component.html',
    styleUrls: ['./team-team-match-card.component.scss']
})
export class TeamTeamMatchCardComponent implements AfterViewInit, OnDestroy {
    constructor(private teamMatchService: TeamMatchService, private changeDetectorRef: ChangeDetectorRef, private timePipe: TimePipe) {}

    @Input() teamTeamMatch: TeamTeamMatch;
    @Input() round: number;
    @Input() competitionId: number;

    clubsImagesUrl: string = environment.apiImageClubs;
    errorTeamMatches: string;
    expandedTeamMatch: boolean;
    isTeamMatchBlocked = TeamCompetitionService.isTeamMatchBlocked;
    isTeamMatchGuessed = TeamCompetitionService.isTeamMatchGuessed;
    noTeamMatches = 'Цей раунд ще не почався / матчів не знайдено';
    showScoresOrString = UtilsService.showScoresOrString;
    spinnerTeamMatches: boolean;
    teamImageDefault: string = environment.imageTeamDefault;
    teamsImagesUrl: string = environment.apiImageTeams;
    teamMatches: TeamMatch[];
    userImageDefault: string = environment.imageUserDefault;
    userImagesUrl: string = environment.apiImageUsers;

    getTeamMatchesData(teamTeamMatch: TeamTeamMatch) {
        this.spinnerTeamMatches = true;
        const param = [
            { parameter: 'filter', value: 'team-team-match' },
            { parameter: 'competition_id', value: this.competitionId.toString() }
        ];
        param.push({ parameter: 'home_team_id', value: teamTeamMatch.home_team_id.toString() });
        param.push({ parameter: 'away_team_id', value: teamTeamMatch.away_team_id.toString() });
        if (this.round) {
            param.push({ parameter: 'round', value: this.round.toString() });
        }
        this.teamMatchService.getTeamMatches(param).subscribe(
            response => {
                if (response) {
                    this.teamMatches = response.team_matches;
                }
                this.spinnerTeamMatches = false;
                $(() => $('[data-toggle="tooltip"]').tooltip());
                this.changeDetectorRef.detectChanges();
            },
            error => {
                this.errorTeamMatches = error;
                this.spinnerTeamMatches = false;
                this.changeDetectorRef.detectChanges();
            }
        );
    }

    getPredictionDetails(teamMatch: TeamMatch, teamId: number) {
        if (teamMatch.team_predictions) {
            const teamPrediction = teamMatch.team_predictions.find(prediction => teamId === prediction.team_id);
            if (teamPrediction) {
                return {
                    user: teamPrediction.user || null,
                    prediction: UtilsService.isScore(teamPrediction.home, teamPrediction.away)
                        ? {
                              home: teamPrediction.home,
                              away: teamPrediction.away,
                              short: teamPrediction.home + ':' + teamPrediction.away,
                              long: teamPrediction.home + ' : ' + teamPrediction.away
                          }
                        : null
                };
            }
        }
        return { user: null, prediction: null };
    }

    isTeamMatchPredictable(teamMatch: TeamMatch) {
        return teamMatch.is_predictable;
    }

    getTitle(teamMatch: TeamMatch, teamId: number): string {
        if (teamMatch.is_predictable) {
            return 'Прогнози гравців відображаються після початку другого тайму матчу';
        } else if (teamMatch.team_predictions) {
            const teamPrediction = teamMatch.team_predictions.find(prediction => teamId === prediction.team_id);
            if (teamPrediction) {
                if (!UtilsService.isScore(teamPrediction.home, teamPrediction.away)) {
                    return 'Прогноз не зроблено';
                }
                const date = this.timePipe.transform(teamPrediction.predicted_at, 'YYYY-MM-DD HH:mm');
                return 'Прогноз зроблено ' + date;
            }
        }

        return 'Прогноз не зроблено';
    }

    getUserImageSource(user: User): string | null {
        if (!user) {
            return null;
        }

        return this.userImagesUrl + (user.image || this.userImageDefault);
    }

    ngAfterViewInit() {
        const id = '#collapseTeamTeamMatch' + this.teamTeamMatch.id;
        $(id).on('hidden.bs.collapse', () => {
            this.toggleChevron();
            this.changeDetectorRef.detectChanges();
        });
        $(id).on('shown.bs.collapse', () => {
            this.getTeamMatchesData(this.teamTeamMatch);
        });
        $(id).on('show.bs.collapse', () => {
            this.toggleChevron();
            this.spinnerTeamMatches = true;
            this.changeDetectorRef.detectChanges();
        });
    }

    ngOnDestroy() {
        $('[data-toggle="tooltip"]').tooltip('dispose');
    }

    toggleChevron() {
        this.expandedTeamMatch = !this.expandedTeamMatch;
    }
}
