import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CoreModule } from '../../core.module';
import { SafePipe } from '../../pipes/safe.pipe';
import { DashboardService } from '../../../services/dashboard.service';
import { AbstractComponent } from '../abstract.component';

@Component({
  selector: 'app-buien-radar',
  standalone: true,
  imports: [CoreModule, SafePipe],
  templateUrl: './buien-radar.component.html',
  styleUrl: './buien-radar.component.scss',
})
export class BuienRadarComponent implements OnChanges, AbstractComponent {
  constructor(public dashboard: DashboardService) {}

  @Input() config!: { [key: string]: any };

  buienradarIframeSrc = '';

  ngOnChanges(changes: SimpleChanges): void {
    this.buienradarIframeSrc = this.config['automaticLocationEnabled']
      ? this.getSrc(
          this.dashboard.userSessionSettings.lon.toString(),
          this.dashboard.userSessionSettings.lat.toString()
        )
      : this.getSrc(this.config['lon'], this.config['lat']);
  }

  getSrc(lon: string, lat: string) {
    return `https://image.buienradar.nl/2.0/image/single/RadarMapRainNL?height=256&width=256&renderBackground=True&renderBranding=False&renderText=True&lat=${lat}&lon=${lon}`;
  }
}
