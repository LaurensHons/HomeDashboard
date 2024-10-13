import { Injectable, TemplateRef, Type } from '@angular/core';
import { BehaviorSubject, filter, map, Observable, Subject } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import {
  CookieDefaults,
  CookieKey,
  PartCookie,
  PartCookieMapper,
} from './cookie.helpers';
import { BuienradarGraphComponent } from '../components/buienradar-graph/buienradar-graph.component';
import { NmbsComponent } from '../components/nmbs/nmbs.component';
import { BuienRadarComponent } from '../components/buien-radar/buien-radar.component';
import { Part } from '../layout/grid/grid.component';
import { v4 } from 'uuid';
import { CustomCookieService } from './cookie.service';

export const PartTypes: () => {
  [x: string]: {
    displayName: string;
    type: Type<any>;
  };
} = () => {
  return {
    buienradar: {
      displayName: 'Buien Radar',
      type: BuienRadarComponent,
    },
    buiengraph: {
      displayName: 'Buien Graph',
      type: BuienradarGraphComponent,
    },
    nmbs: {
      displayName: 'NMBS station viewer',
      type: NmbsComponent,
    },
  };
};

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private _partList = new BehaviorSubject<Part[] | undefined>(undefined);

  private _userSessionSettings = {
    lon: 0,
    lat: 0,
  };

  public userSessionSettingChange = new Subject<void>();

  constructor(private cookieService: CustomCookieService) {
    this.partListObserver.subscribe((list) => {
      this.updateCookies(list);
    });
  }

  get partList() {
    return this._partList.value ?? [];
  }
  set partList(i) {
    this._partList.next(i);
  }
  get userSessionSettings() {
    return this._userSessionSettings;
  }

  get partListObserver(): Observable<Part[]> {
    return this._partList.pipe(filter((t) => !!t)) as Observable<Part[]>;
  }

  public partListChange() {
    this._partList.next(this._partList.value);
  }

  public setCoords(lon: number, lat: number) {
    this._userSessionSettings.lon = lon;
    this._userSessionSettings.lat = lat;
    this.userSessionSettingChange.next();
  }

  public initDefaultCookie() {
    const value = this.cookieService.getKey(
      CookieKey.DashboardSavedPartKey
    ) as PartCookie[];
    this.partList = value
      .map((c) => new Part({ ...c }))
      .filter((t) => t.typeName != null);
    console.log('cookie: ' + value);
    if (this.partList.length == 0)
      this.partList = CookieDefaults[CookieKey.DashboardSavedPartKey];
  }

  private updateCookies(list: Part[]) {
    const cookies = list.map((p) => PartCookieMapper(p));
    this.cookieService.setKey(CookieKey.DashboardSavedPartKey, cookies);
    console.log('saving cookies', cookies);
  }
}
