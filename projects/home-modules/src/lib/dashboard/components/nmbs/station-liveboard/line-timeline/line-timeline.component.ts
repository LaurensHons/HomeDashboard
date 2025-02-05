import { Component, Input } from '@angular/core';
import { NMBSStop } from '../../../../core/models/nmbs.models';
import { CoreModule } from '../../../../core.module';

@Component({
  selector: 'app-line-timeline',
  standalone: true,
  imports: [CoreModule],
  templateUrl: './line-timeline.component.html',
  styleUrl: './line-timeline.component.scss',
})
export class LineTimelineComponent {
  @Input() stops: NMBSStop[] = [];
}
