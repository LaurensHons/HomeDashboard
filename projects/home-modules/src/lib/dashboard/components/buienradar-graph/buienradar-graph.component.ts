import {
  Component,
  inject,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { CoreModule } from '../../core.module';
import { BRFunctionsService } from '../../core/services/buienradar.functions.service';
import { Subject, first, merge, takeUntil, zip } from 'rxjs';
import { ChartData, ChartOptions } from 'chart.js';
import { RefreshService } from '../../../services/refresh.service';
import { DashboardService } from '../../../services/dashboard.service';
import { AbstractComponent } from '../abstract.component';

@Component({
  selector: 'app-buienradar-graph',
  standalone: true,
  imports: [CoreModule],
  templateUrl: './buienradar-graph.component.html',
  styleUrl: './buienradar-graph.component.scss',
})
export class BuienradarGraphComponent
  implements OnInit, OnDestroy, AbstractComponent
{
  @Input() config!: { [key: string]: any };
  data: ChartData | undefined;

  dashboard = inject(DashboardService) as DashboardService;
  refresh = inject(RefreshService) as RefreshService;
  BRFunc = inject(BRFunctionsService) as BRFunctionsService;

  options: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },

    interaction: {
      intersect: false,
    },
    scales: {
      x: {
        display: true,
        title: {
          display: false,
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'mm/h',
        },
        suggestedMin: 0,
        suggestedMax: 5,
      },
    },
  };

  loading = false;

  getRadarData() {
    const pos: { lon: number; lat: number } =
      this.dashboard.userSessionSettings;
    if (!pos.lat && !pos.lon) return;
    if (this.loading) return;
    this.loading = true;
    this.BRFunc.getRadarInfo(pos.lat, pos.lon)
      .pipe(first())
      .subscribe((data) => {
        const splits = (data as string).split('\n');
        this.data = {
          labels: [],
          datasets: [
            {
              label: '',
              data: [],
              fill: false,
              borderColor: '#4bc0c0',
              tension: 0.1,
              cubicInterpolationMode: 'monotone',
            },
          ],
        };
        splits.forEach((s) => {
          const split = s.split('|');
          const rain = Number(split[0]?.trim());
          if (isNaN(rain)) return;
          const mmsPerHr = this.neerslagIntensiteit(rain);
          this.data!.labels!.push(split[1]?.trim());
          this.data!.datasets[0].data.push(mmsPerHr);
        });
        this.loading = false;
      });
  }

  neerslagIntensiteit(rain: number): number {
    return Math.pow(10, (rain - 109) / 32);
  }

  ngOnInit(): void {
    this.getRadarData();
    this.refresh.refresh
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.getRadarData());

    this.dashboard.userSessionSettingChange
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.getRadarData());
  }
  destroy$ = new Subject<void>();
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
