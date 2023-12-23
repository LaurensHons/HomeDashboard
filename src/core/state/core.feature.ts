import { InjectionToken } from '@angular/core';
import { ActionReducerMap } from '@ngrx/store';

import { StateEffects } from './state.effects';
import { featureSlice, ApplicationState, Reducer } from './state.reducer';

export const featureKey = 'coreFeature';

export interface CoreState {
  [featureSlice]: ApplicationState;
}

export const reducers = new InjectionToken<ActionReducerMap<CoreState>>(
  featureKey,
  {
    factory: () => ({
      [featureSlice]: Reducer,
    }),
  }
);
export const effects = [StateEffects];
