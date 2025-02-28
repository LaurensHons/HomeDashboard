import { CookieOptions, CookieService } from 'ngx-cookie-service';
import { CookieDefaults, CookieKey, LocalStorageKey } from './cookie.helpers';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Observer, Subject } from 'rxjs';
import { JsonPipe } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class CustomCookieService {
  constructor(private cookieService: CookieService) {}

  cookieObservables: { [key: string]: BehaviorSubject<string | undefined> } =
    {};

  setCookie(key: CookieKey, value: string) {
    this.cookieService.set(key, value);
    if (this.cookieObservables[key]) this.cookieObservables[key].next(value);
    else
      this.cookieObservables[key] = new BehaviorSubject<string | undefined>(
        value
      );
  }

  getCookie(key: CookieKey) {
    if (this.cookieObservables[key]) return this.cookieObservables[key].value;
    var value = this.cookieService.get(key);
    this.cookieObservables[key] = new BehaviorSubject<string | undefined>(
      value
    );
    return value;
  }

  setCookieObject(key: CookieKey, value: any) {
    this.setCookie(key, JSON.stringify(value));
  }

  getCookieObject<T>(key: CookieKey): T {
    var value = this.getCookie(key);
    try {
      if (!value) throw 'novalue';
      return JSON.parse(value);
    } catch {
      return CookieDefaults[key];
    }
  }

  deleteCookie(key: CookieKey) {
    this.cookieService.delete(key);
    if (this.cookieObservables[key])
      this.cookieObservables[key].next(undefined);
  }

  observeCookie(key: CookieKey): Observable<string | undefined> {
    if (!this.cookieObservables[key])
      this.cookieObservables[key] = new BehaviorSubject<string | undefined>(
        this.cookieService.get(key)
      );
    return this.cookieObservables[key].asObservable();
  }

  getLocalStorage<T>(key: LocalStorageKey) {
    var value = localStorage.getItem(key);
    if (!value) return null;
    return JSON.parse(value) as T;
  }

  setLocalStorage(key: LocalStorageKey, value: any) {
    localStorage.setItem(key, JSON.parse(value));
  }
}
