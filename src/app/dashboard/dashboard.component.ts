import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { StateFacade } from '../../core/state/state.facade';
import { CoreModule } from '../core.module';
import { StationSelectComponent } from '../components/station-select/station-select.component';
import { NMBSStation } from '../../core/models/nmbs.models';
import { StationLiveboardComponent } from '../components/station-liveboard/station-liveboard.component';
import { BuienradarGraphComponent } from '../components/buienradar-graph/buienradar-graph.component';
import {
  BehaviorSubject,
  Subject,
  combineLatest,
  delay,
  startWith,
  takeUntil,
} from 'rxjs';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { SafePipe } from '../pipes/safe.pipe';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CoreModule,
    StationSelectComponent,
    StationLiveboardComponent,
    BuienradarGraphComponent,
    SafePipe,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  animations: [
    trigger('openClose', [
      // ...
      state(
        'open',
        style({
          height: '25px',
          opacity: 1,
        })
      ),
      state(
        'closed',
        style({
          height: '6px',
          opacity: 0.8,
        })
      ),
      transition('open => closed', [animate('0.2s')]),
      transition('closed => open', [animate('0.5s')]),
    ]),
  ],
})
export class DashboardComponent implements OnInit, OnDestroy {
  stations$ = this.fac.stations$;
  activeNMBSSation: NMBSStation | undefined;

  @ViewChild('stationSelect') stationSelect!: StationSelectComponent;

  lon: number = 0;
  lat: number = 0;

  timeoutSeconds = 30;
  timeout = new Subject<number>();
  timeoutPercentage = new BehaviorSubject<number>(0);

  refresh = new Subject<void>();
  reset = new Subject<void>();

  hover = false;

  constructor(private fac: StateFacade) {}

  ngOnInit(): void {
    navigator.geolocation.getCurrentPosition(
      (loc: any) => {
        console.log(loc);
        this.lon = loc.coords.longitude;
        this.lat = loc.coords.latitude;
      },
      function () {
        alert('User not allowed');
      },
      { timeout: 10000 }
    );

    this.timeout
      .pipe(takeUntil(this.destroy$), delay(1000))
      .subscribe((delay) => {
        if (delay >= this.timeoutSeconds) {
          this.refresh.next();
          this.timeout.next(0);
        } else {
          this.timeout.next(delay + 1);
        }
      });

    this.timeout.pipe(takeUntil(this.destroy$)).subscribe((delay) => {
      this.timeoutPercentage.next(100 - (delay / this.timeoutSeconds) * 100);
    });

    this.timeout.next(0);

    this.timeoutPercentage.subscribe((p) => console.log(p));
  }

  get buienradarIframe() {
    return `https://image.buienradar.nl/2.0/image/single/RadarMapRainNL?height=256&width=256&renderBackground=True&renderBranding=False&renderText=True&lat=${this.lat}&lon=${this.lon}`;
  }

  resetTimer() {}

  onProgressbarClick() {
    this.refresh.next();
    this.resetTimer();
  }

  onStationChange(station: NMBSStation) {
    console.log(station);
  }

  saveStation(station: NMBSStation) {
    this.stationSelect.saveFavorite(station);
  }

  destroy$ = new Subject<void>();
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

    this.timeout.complete();
  }
}
