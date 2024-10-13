import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, map, Observable, Subject } from 'rxjs';
import { CookieDefaults, CookieKey } from './cookie.helpers';
import { CustomCookieService } from './cookie.service';
import { Part, PartCookie, PartCookieMapper } from '../layout/grid/part.model';

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

  public getPartConfigObserver(id: string) {
    return this._partList.pipe(map((l) => l?.find((p) => p.id === id)?.config));
  }

  public setCoords(lon: number, lat: number) {
    this._userSessionSettings.lon = lon;
    this._userSessionSettings.lat = lat;
    this.userSessionSettingChange.next();
  }

  public initDefaultCookie() {
    const value = this.cookieService.getLocalstorage(
      CookieKey.DashboardSavedPartKey
    ) as PartCookie[];
    this.partList = value
      .map((c) => new Part({ ...c }))
      .filter((t) => t.typeName != null);
    if (this.partList.length == 0)
      this.partList = CookieDefaults[CookieKey.DashboardSavedPartKey];
  }

  private updateCookies(list: Part[]) {
    const cookies = list.map((p) => PartCookieMapper(p));
    this.cookieService.setLocalstorage(
      CookieKey.DashboardSavedPartKey,
      cookies
    );
    console.log('saving cookies', cookies);
  }
}
