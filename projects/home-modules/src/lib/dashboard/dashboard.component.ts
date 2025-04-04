import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  Component,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Type,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { CookieService } from 'ngx-cookie-service';
import { Subject } from 'rxjs';
import { BuienradarGraphComponent } from './components/buienradar-graph/buienradar-graph.component';
import { CoreModule } from './core.module';
import { GridComponent } from './layout/grid/grid.component';
import { SafePipe } from './pipes/safe.pipe';
import { KeyValuePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { PartType, PartTypes } from './part.types';
import { MatDialog } from '@angular/material/dialog';
import { Part } from './layout/grid/part.model';
import { EditPartPopupComponent } from './layout/edit-part-popup/edit-part-popup.component';
import { NmbsComponent } from './components/nmbs/nmbs.component';
import { v4 } from 'uuid';
import { CustomCookieService } from '../services/cookie.service';
import { DashboardService } from '../services/dashboard.service';
import { RefreshService } from '../services/refresh.service';
import { CookieKey } from '../services/cookie.helpers';

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

  isDarkMode!: boolean;

  public cookieService = inject(CustomCookieService);
  public dashboard = inject(DashboardService);
  public refreshService = inject(RefreshService);
  private dialog = inject(MatDialog);

  ngOnInit(): void {
    navigator.geolocation.getCurrentPosition(
      (loc) => {
        console.log(loc);
        this.dashboard.setCoords(loc.coords.longitude, loc.coords.latitude);
      },
      (e) => {
        console.error('User did not allow geolocation', e);
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

  elementsChanged(list: Part[]) {
    this.dashboard.partList = list;
  }

  iframeScale(iframe: HTMLElement, parentDiv: HTMLElement) {
    if (iframe.style.scale != '1' && iframe.style.scale != '')
      return iframe.style.scale;
    let { width: cw, height: ch } = iframe.getBoundingClientRect();
    let { width: pw, height: ph } = parentDiv.getBoundingClientRect();
    return Math.min(pw / cw, ph / ch);
  }

  addPart(typeName: string) {
    if (PartTypes()[typeName as PartType])
      this.dashboard.partList = [
        ...this.dashboard.partList,
        new Part({
          id: v4(),
          typeName: typeName as PartType,
          x: 0,
          y: 0,
          height: 2,
          width: 2,
        }),
      ];
  }

  openEditMenu(part: Part) {
    if (!PartTypes()[part.typeName].configType) throw 'No config type found';
    this.dialog.open(EditPartPopupComponent, {
      data: part,
      height: '40%',
      width: '40%',
      minHeight: '400px',
      minWidth: '400px',
    });
  }

  destroy$ = new Subject<void>();
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
