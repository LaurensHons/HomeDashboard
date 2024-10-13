import { Component } from '@angular/core';
import { CoreModule } from '../../core.module';
import { SafePipe } from '../../pipes/safe.pipe';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-buien-radar',
  standalone: true,
  imports: [CoreModule, SafePipe],
  templateUrl: './buien-radar.component.html',
  styleUrl: './buien-radar.component.scss',
})
export class BuienRadarComponent {
  constructor(public dashboard: DashboardService) {}

  get buienradarIframe() {
    return `https://image.buienradar.nl/2.0/image/single/RadarMapRainNL?height=256&width=256&renderBackground=True&renderBranding=False&renderText=True&lat=${this.dashboard.userSessionSettings.lat}&lon=${this.dashboard.userSessionSettings.lon}`;
  }
}
