import { CookieOptions, CookieService } from 'ngx-cookie-service';
import { CookieDefaults, CookieKey } from './cookie.helpers';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CustomCookieService {
  constructor(private cookies: CookieService) {}

  public getKey(key: CookieKey): any {
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

  public setKey(key: CookieKey, value: any) {
    this.cookies.set(key, JSON.stringify(value));
  }
}
