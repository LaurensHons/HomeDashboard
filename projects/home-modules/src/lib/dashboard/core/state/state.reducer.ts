import { Action, createAction, createReducer, on } from '@ngrx/store';
import * as fromCore from '../../../core.feature';
import { NMBSDeparture, NMBSStation } from '../models/nmbs.models';
import {
  getNMBSDeparturesResolved,
  getNMBSStationsResolved,
} from './state.actions';

export interface AppState {
  [fromCore.componentFeatureKey]: fromCore.ComponentState;
}

export const featureSlice = 'stateFeature';

export interface ApplicationState {
  stations: NMBSStation[];
  liveboards: { [key: string]: NMBSDeparture[] };
}

const defaultState: ApplicationState = {
  stations: [],
  liveboards: {},
};

export const initialState: ApplicationState = defaultState;

export const featureState = (state: AppState) =>
  state?.componentfeatures.stateFeature;

export function Reducer(state: ApplicationState | undefined, action: Action) {
  return StateReducer(state, action);
}

export const StateReducer = createReducer(
  initialState,
  on(getNMBSStationsResolved, (state, { stations }) => ({
    ...state,
    stations: stations,
  })),
  on(getNMBSDeparturesResolved, (state, { stationId, departures }) => ({
    ...state,
    liveboards: {
      ...state.liveboards,
      [stationId]: departures,
    },
  }))
  // on(getCheckListItemsByTaskIdResolved, (state, { checklistItems }) => ({
  //   ...state,
  //   checklistItems: [...checklistItems],
  // })),
);
