import { InjectionToken } from '@angular/core';
import { ActionReducerMap } from '@ngrx/store';

import { StateEffects } from './dashboard/core/state/state.effects';
import {
  featureSlice,
  ApplicationState,
  Reducer,
} from './dashboard/core/state/state.reducer';

export const componentFeatureKey = 'componentfeatures';

export interface ComponentState {
  [featureSlice]: ApplicationState;
}

export const componentReducers = new InjectionToken<
  ActionReducerMap<ComponentState>
>(componentFeatureKey, {
  factory: () => ({
    [featureSlice]: Reducer,
  }),
});
export const componentEffects = [StateEffects];
