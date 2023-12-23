import { Injectable } from '@angular/core';
import {
  Action,
  ActionCreator,
  State,
  Store,
  createReducer,
  select,
} from '@ngrx/store';
import { Observable, Subject, filter, map } from 'rxjs';
import { AppState, featureState } from './state.reducer';
import { NMBSStation } from '../models/nmbs.models';
import { getNMBSDepartures, getNMBSStations } from './state.actions';
import { TypedAction } from '@ngrx/store/src/models';
import { ActionBase } from './action-base.interface';

@Injectable({ providedIn: 'root' })
export class StateFacade {
  constructor(private _store: Store<AppState>) {}

  stations$ = this._store.pipe(
    select(featureState),
    map((state) => state.stations)
  );

  liveboards$ = this._store.pipe(
    select(featureState),
    map((state) => state.liveboards)
  );

  getNMBSStations() {
    const subject = new Subject<void>();
    this._store.dispatch(
      getNMBSStations({
        callback: () => {
          subject.next();
          subject.complete();
        },
      })
    );
    return subject.asObservable();
  }

  getLiveboard(stationId: string, callback?: (success: boolean) => void) {
    return this.dispatchAction$(getNMBSDepartures, { stationId });
  }

  liveBoard$(stationId: string) {
    return this.liveboards$.pipe(map((liveboards) => liveboards[stationId]));
  }

  dispatchAction$<R, P>(
    action: ActionCreator<
      string,
      (props: P & ActionBase<R>) => (P & ActionBase<R>) & TypedAction<string>
    >,
    props?: P
  ) {
    return new Observable<R>((subscriber) => {
      this._store.dispatch(
        action({
          callback: (value: R) => {
            subscriber.next(value);
            subscriber.complete();
          },
          error: (e: Error) => {
            subscriber.error(e);
            subscriber.complete();
          },
          ...props,
        } as P & ActionBase<R>) as Action
      );
    });
  }
}
