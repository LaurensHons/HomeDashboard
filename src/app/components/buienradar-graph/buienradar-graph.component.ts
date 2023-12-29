import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { CoreModule } from '../../core.module';
import { BRFunctionsService } from '../../../core/services/buienradar.functions.service';
import { Subject, first, takeUntil } from 'rxjs';
import { ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-buienradar-graph',
  standalone: true,
  imports: [CoreModule],
  templateUrl: './buienradar-graph.component.html',
  styleUrl: './buienradar-graph.component.scss',
})
export class BuienradarGraphComponent implements OnInit, OnChanges, OnDestroy {
  @Input() lat!: number;
  @Input() lon!: number;
  @Input() refreshObservable: Subject<void> | undefined;

  data: ChartData | undefined;

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

  constructor(private BRFunc: BRFunctionsService) {}

  ngOnChanges(changes: SimpleChanges): void {
    const hasChanges = (key: string) =>
      (changes[key] &&
        changes[key].currentValue !== changes[key].previousValue) ||
      changes[key].isFirstChange();
    if (hasChanges('lat') || hasChanges('lon')) {
      this.getRadarData();
    }
  }

  getRadarData() {
    if (!this.lat && !this.lon) return;
    if (this.loading) return;
    this.loading = true;
    this.BRFunc.getRadarInfo(this.lat, this.lon)
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
    this.refreshObservable
      ?.pipe(takeUntil(this.destroy$))
      .subscribe(() => this.getRadarData());
  }
  destroy$ = new Subject<void>();
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
