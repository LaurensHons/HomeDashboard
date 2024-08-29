import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
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
import { NmbsComponent } from '../components/nmbs/nmbs.component';
import {
  GridComponent,
  Part,
  PartPosition,
} from '../components/grid/grid.component';
import { CookieService } from 'ngx-cookie-service';
import { Serializer } from '@angular/compiler';
import {
  DashboardSavedPartKey,
  PartCookie,
  PartCookieMapper,
} from '../cookie.helpers';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CoreModule,
    BuienradarGraphComponent,
    SafePipe,
    NmbsComponent,
    GridComponent,
    MatMenuModule,
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
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  lon: number = 0;
  lat: number = 0;

  timeoutSeconds = 30;
  timeout = new Subject<number>();
  timeoutPercentage = new BehaviorSubject<number>(0);

  refresh = new Subject<void>();
  reset = new Subject<void>();

  hover = false;
  edit = false;

  parts: Part[] = [];

  @ViewChild('buienradar') buienradar!: TemplateRef<HTMLElement>;
  @ViewChild('buiengraph') buiengraph!: TemplateRef<HTMLElement>;
  @ViewChild('nmbs') nmbs!: TemplateRef<HTMLElement>;

  partTypeDict: {
    [id: string]: { comp: TemplateRef<HTMLElement>; displayName: string };
  } = {};

  get partTypeDictList() {
    return Object.keys(this.partTypeDict).map((d) => ({
      ...this.partTypeDict[d],
      name: d,
    }));
  }

  InitPartTypeDict() {
    this.partTypeDict = {
      buienradar: { comp: this.buienradar, displayName: 'Buien Radar' },
      buiengraph: { comp: this.buiengraph, displayName: 'Buien Graph' },
      nmbs: { comp: this.nmbs, displayName: 'NMBS station viewer' },
    };
  }

  constructor(private cookieService: CookieService) {}

  ngAfterViewInit(): void {
    this.InitPartTypeDict();
    this.InitDashboardParts();
  }

  ngOnInit(): void {
    navigator.geolocation.getCurrentPosition(
      (loc: any) => {
        console.log(loc);
        this.lon = loc.coords.longitude;
        this.lat = loc.coords.latitude;
      },
      function () {
        alert('User did not allow geolocation');
      },
      { timeout: 10000 }
    );

    this.timeout
      .pipe(takeUntil(this.destroy$), delay(100000))
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

  InitDashboardParts() {
    if (!this.cookieService.check(DashboardSavedPartKey))
      this.InitDefaultParts();
    else {
      console.log('cookie found trying to load');
      try {
        const value = this.cookieService.get(DashboardSavedPartKey);
        const cookies = JSON.parse(value) as PartCookie[];
        this.parts = cookies.map(
          (c) => new Part(c.name, this.partTypeDict[c.name].comp, c)
        );
      } catch (e: any) {
        console.log('error during loading cookies', e);
        this.InitDefaultParts();
      }
    }
  }

  InitDefaultParts() {
    console.log('no cookies found, initing default config');
    this.parts = [
      new Part('nmbs', this.nmbs, { y: 2, width: 2, height: 2 }),
      new Part('buienradar', this.buienradar, { y: 2, width: 2, height: 2 }),
      new Part('buiengraph', this.buiengraph, {
        x: 2,
        y: 2,
        width: 4,
        height: 2,
      }),
    ];
  }

  onProgressbarClick() {
    this.refresh.next();
  }

  addPart(name: string, template: TemplateRef<HTMLElement>, pos: PartPosition) {
    this.parts = [...this.parts, new Part(name, template, pos)];
    this.elementsChanged();
  }

  elementsChanged() {
    const cookies = this.parts.map((p) => PartCookieMapper(p));
    this.cookieService.set(DashboardSavedPartKey, JSON.stringify(cookies));
    console.log('saving cookies', cookies);
  }

  destroy$ = new Subject<void>();
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

    this.timeout.complete();
  }
}
