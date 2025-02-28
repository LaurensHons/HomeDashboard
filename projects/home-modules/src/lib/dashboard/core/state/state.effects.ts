import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, mergeMap, switchMap, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { NMBSFunctionsService } from '../services/nmbs.functions.service';
import {
  getNMBSDepartures,
  getNMBSDeparturesResolved,
  getNMBSStations,
  getNMBSStationsResolved,
} from './state.actions';
import { CustomCookieService } from '../../../services/cookie.service';
import { LocalStorageKey } from '../../../services/cookie.helpers';
import { NMBSStation } from '../models/nmbs.models';
import { registry } from 'chart.js';

@Injectable({ providedIn: 'root' })
export class StateEffects {
  constructor(
    private actions$: Actions,
    private nmbsFuncs: NMBSFunctionsService,
    private cookieService: CustomCookieService
  ) {}

  getStations: Observable<any> = createEffect(() =>
    this.actions$.pipe(
      ofType(getNMBSStations),
      mergeMap(({ callback }) => {
        var cached = this.cookieService.getLocalStorage<NMBSStation[]>(
          LocalStorageKey.DashboardNMBSSTATIONCACHE
        );
        if (cached && cached.length)
          return of(getNMBSStationsResolved({ stations: cached }));
        return this.nmbsFuncs.getAllStations().pipe(
          catchError((e) => {
            callback ? callback(false) : undefined;
            return of(undefined);
          }),
          tap(() => (callback ? callback(true) : undefined)),
          switchMap((stations) => {
            this.cookieService.setLocalStorage(
              LocalStorageKey.DashboardNMBSSTATIONCACHE,
              stations
            );
            return of(
              getNMBSStationsResolved({
                stations: stations || [],
              })
            );
          }),
          catchError((e) => [])
        );
      })
    )
  );

  getLiveboard: Observable<any> = createEffect(() =>
    this.actions$.pipe(
      ofType(getNMBSDepartures),
      mergeMap(({ stationId, callback }) =>
        this.nmbsFuncs.getDeparturesAndArrivals(stationId).pipe(
          tap((departures) =>
            callback ? callback({ stationId, departures }) : undefined
          ),
          switchMap((departures) =>
            of(getNMBSDeparturesResolved({ stationId, departures }))
          ),
          catchError((e) => [])
        )
      )
    )
  );
}
