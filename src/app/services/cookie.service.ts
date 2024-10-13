import { CookieOptions, CookieService } from 'ngx-cookie-service';
import { CookieDefaults, CookieKey } from './cookie.helpers';
import { Injectable } from '@angular/core';
import { Observer, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CustomCookieService {
  constructor(private cookies: CookieService) {}

  private _localstorageObservers: { [key: string]: Observer<any> } = {};

  public getCookie(key: CookieKey): any {
    if (!this.cookies.check(key)) return CookieDefaults[key];
    else {
      console.log('cookie found trying to load');
      try {
        const value = this.cookies.get(key);
        return JSON.parse(value);
      } catch (e: any) {
        console.log('error during loading cookies', e);
        return CookieDefaults[key];
      }
    }
  }

  public setCookie(key: CookieKey, value: any) {
    this.cookies.set(key, JSON.stringify(value));
  }

  public getKeyObserver(key: CookieKey) {
    if (this._localstorageObservers[key])
      return this._localstorageObservers[key];
    const value = this.getLocalstorage(key);
    const obs = new Subject<any>();
    this._localstorageObservers[key] = obs;
    return obs;
  }

  public getLocalstorage(key: CookieKey): any {
    const value = localStorage.getItem(key);
    if (!value) return CookieDefaults[key];
    else {
      console.log('cookie found trying to load');
      try {
        return JSON.parse(value);
      } catch (e: any) {
        console.log('error during loading cookies', e);
        return CookieDefaults[key];
      }
    }
  }

  setLocalstorage(key: CookieKey, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
    if (this._localstorageObservers[key])
      this._localstorageObservers[key].next(value);
  }
}
