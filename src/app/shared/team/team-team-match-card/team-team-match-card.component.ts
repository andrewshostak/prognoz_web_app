import { AfterViewInit, Component, Input, ChangeDetectorRef }   from '@angular/core';

import { environment }                                          from '../../../../environments/environment';
import { HelperService }                                        from '../../../core/helper.service';
import { TeamMatch }                                            from '../../models/team-match.model';
import { TeamMatchService }                                     from '../../../team/shared/team-match.service';
import { TeamTeamMatch }                                        from '../../models/team-team-match.model';

declare var $: any;

@Component({
    selector: 'app-team-team-match-card',
    templateUrl: './team-team-match-card.component.html',
    styleUrls: ['./team-team-match-card.component.css']
})
export class TeamTeamMatchCardComponent implements AfterViewInit {

    constructor(
        private teamMatchService: TeamMatchService,
        public helperService: HelperService,
        private changeDetectorRef: ChangeDetectorRef
    ) {}

    @Input() teamTeamMatch: TeamTeamMatch;
    @Input() round: number;

    clubsImagesUrl: string = environment.apiImageClubs;
    errorTeamMatches: string;
    expandedTeamMatch: boolean;
    noTeamMatches: string = 'Цей раунд ще не почався / матчів не знайдено';
    spinnerTeamMatches: boolean;
    teamImageDefault: string = environment.imageTeamDefault;
    teamsImagesUrl: string = environment.apiImageTeams;
    teamMatches: TeamMatch[];
    userImageDefault: string = environment.imageUserDefault;
    userImagesUrl: string = environment.apiImageUsers;

    getTeamMatchesData(teamTeamMatch: TeamTeamMatch) {
        this.spinnerTeamMatches = true;
        let param = [{parameter: 'filter', value: 'team-team-match'}];
        param.push({parameter: 'home_team_id', value: teamTeamMatch.home_team_id.toString()});
        param.push({parameter: 'away_team_id', value: teamTeamMatch.away_team_id.toString()});
        if (this.round) param.push({parameter: 'round', value: this.round.toString()});
        this.teamMatchService.getTeamMatches(param).subscribe(
            response => {
                if (response) this.teamMatches = response.team_matches;
                this.spinnerTeamMatches = false;
                this.changeDetectorRef.detectChanges();
            },
            error => {
                this.errorTeamMatches = error;
                this.spinnerTeamMatches = false;
                this.changeDetectorRef.detectChanges();
            }
        );
    }

    getPredictionDetails(teamMatch: TeamMatch, teamId: number): {name: string, prediction: string, predicted_at: string} {
        if (teamMatch.is_predictable) {
            return {name: '?', prediction: '?', predicted_at: '?'};
        } else if (teamMatch.team_predictions) {
            let teamPrediction = teamMatch.team_predictions.find((teamPrediction) => teamId === teamPrediction.team_id);
            if (teamPrediction) {
                return {
                    name: teamPrediction.user ? teamPrediction.user.name : '-',
                    prediction: this.helperService.isScore(teamPrediction.home, teamPrediction.away)
                        ? `${teamPrediction.home} : ${teamPrediction.away}` : '-',
                    predicted_at: this.helperService.isScore(teamPrediction.home, teamPrediction.away)
                        ? teamPrediction.predicted_at : '-'
                };
            }
        }
        return {name: '-', prediction: '-', predicted_at: '-'};
    }

    ngAfterViewInit() {
        let id = '#collapseTeamTeamMatch' + this.teamTeamMatch.id;
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

    toggleChevron() {
        this.expandedTeamMatch = !this.expandedTeamMatch;
    }
}
