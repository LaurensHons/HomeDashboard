import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, mergeMap, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { NMBSFunctionsService } from '../services/nmbs.functions.service';
import {
  getNMBSDepartures,
  getNMBSDeparturesResolved,
  getNMBSStations,
  getNMBSStationsResolved,
} from './state.actions';

@Injectable({ providedIn: 'root' })
export class StateEffects {
  constructor(
    private actions$: Actions,
    private nmbsFuncs: NMBSFunctionsService
  ) {}

  getStations = createEffect(() =>
    this.actions$.pipe(
      ofType(getNMBSStations),
      mergeMap(({ callback }) =>
        this.nmbsFuncs.getAllStations().pipe(
          catchError((e) => {
            callback ? callback(false) : undefined;
            return of(undefined);
          }),
          tap(() => (callback ? callback(true) : undefined)),
          switchMap((stations) =>
            of(
              getNMBSStationsResolved({
                stations: stations || [],
              })
            )
          ),
          catchError((e) => [])
        )
      )
    )
  );

  getLiveboard = createEffect(() =>
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
