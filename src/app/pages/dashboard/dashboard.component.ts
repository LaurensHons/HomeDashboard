import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, OnDestroy, OnInit, Type } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { CookieService } from 'ngx-cookie-service';
import { Subject } from 'rxjs';
import { BuienradarGraphComponent } from '../../components/buienradar-graph/buienradar-graph.component';
import { NmbsComponent } from '../../components/nmbs/nmbs.component';
import { CoreModule } from '../../core.module';
import { GridComponent, Part } from '../../layout/grid/grid.component';
import { SafePipe } from '../../pipes/safe.pipe';
import { DashboardService, PartTypes } from '../../services/dashboard.service';
import { RefreshService } from '../../services/refresh.service';
import { KeyValuePipe } from '@angular/common';
import { v4 } from 'uuid';
import { MatButtonModule } from '@angular/material/button';
import { CustomCookieService } from '../../services/cookie.service';
import { CookieKey } from '../../services/cookie.helpers';

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
    MatCardModule,
    KeyValuePipe,
    MatButtonModule,
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
  lon: number = 0;
  lat: number = 0;

  hover = false;
  edit = false;

  partTypes = PartTypes();

  get partTypeDictList() {
    return Object.keys(PartTypes()).map((d) => ({
      ...PartTypes()[d],
      name: d,
    }));
  }

  isDarkMode!: boolean;

  constructor(
    private cookieService: CustomCookieService,
    public dashboard: DashboardService,
    public refreshService: RefreshService
  ) {
    this.setDarkMode(cookieService.getKey(CookieKey.DashboardDarkMode));
  }

  ngOnInit(): void {
    navigator.geolocation.getCurrentPosition(
      (loc) => {
        console.log(loc);
        this.dashboard.setCoords(loc.coords.longitude, loc.coords.latitude);
      },
      (e) => {
        alert('User did not allow geolocation');
      },
      { timeout: 10000 }
    );
  }

  get buienradarIframe() {
    return `https://image.buienradar.nl/2.0/image/single/RadarMapRainNL?height=256&width=256&renderBackground=True&renderBranding=False&renderText=True&lat=${this.lat}&lon=${this.lon}`;
  }

  onProgressbarClick() {
    this.refreshService.refresh.next();
  }

  elementsChanged() {
    this.dashboard.partListChange();
  }

  iframeScale(iframe: HTMLElement, parentDiv: HTMLElement) {
    if (iframe.style.scale != '1' && iframe.style.scale != '')
      return iframe.style.scale;
    let { width: cw, height: ch } = iframe.getBoundingClientRect();
    let { width: pw, height: ph } = parentDiv.getBoundingClientRect();
    return Math.min(pw / cw, ph / ch);
  }

  addPart(typeName: string) {
    if (PartTypes()[typeName])
      this.dashboard.partList = [
        ...this.dashboard.partList,
        new Part({
          id: v4(),
          typeName: typeName,
          x: 1,
          y: 1,
          height: 1,
          width: 1,
        }),
      ];
  }

  setDarkMode(isDarkMode: boolean) {
    this.isDarkMode = isDarkMode;
    this.cookieService.setKey(CookieKey.DashboardDarkMode, isDarkMode);
    if (isDarkMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }

  destroy$ = new Subject<void>();
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
