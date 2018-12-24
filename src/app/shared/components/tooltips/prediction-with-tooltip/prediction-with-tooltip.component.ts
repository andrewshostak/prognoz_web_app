import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-prediction-with-tooltip',
    templateUrl: './prediction-with-tooltip.component.html',
    styleUrls: ['./prediction-with-tooltip.component.scss']
})
export class PredictionWithTooltipComponent {
    @Input() componentText: string;
    @Input() tooltipText: string;
    @Input() placement: 'top' | 'right' | 'bottom' | 'left';
}
