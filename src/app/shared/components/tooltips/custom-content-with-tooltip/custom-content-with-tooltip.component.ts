import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-custom-content-with-tooltip',
    templateUrl: './custom-content-with-tooltip.component.html',
    styleUrls: ['./custom-content-with-tooltip.component.scss']
})
export class CustomContentWithTooltipComponent {
    @Input() tooltipText: string;
    @Input() placement: 'top' | 'right' | 'bottom' | 'left';
}
