import { Action, ActionCreator, createAction, props } from '@ngrx/store';
import { ActionBase } from './action-base.interface';
import { NMBSDeparture, NMBSStation } from '../models/nmbs.models';

export const getNMBSStations: ActionCreator<
  '[NMBS] Get stations',
  (props: { callback?: (success: boolean) => void }) => {
    callback?: (success: boolean) => void;
  } & Action
> = createAction(
  '[NMBS] Get stations',
  props<{
    callback?: (success: boolean) => void;
  }>()
);
export const getNMBSStationsResolved: ActionCreator<
  '[NMBS] Get stations resolved',
  (props: { stations: NMBSStation[] }) => {
    stations: NMBSStation[];
  } & Action
> = createAction(
  '[NMBS] Get stations resolved',
  props<{
    stations: NMBSStation[];
  }>()
);

export const getNMBSDepartures: ActionCreator<
  '[NMBS] Get stations',
  (
    props: {
      stationId: string;
    } & ActionBase<{
      stationId: string;
      departures: NMBSDeparture[];
    }>
  ) => {
    stationId: string;
  } & ActionBase<{
    stationId: string;
    departures: NMBSDeparture[];
  }> &
    Action
> = createAction(
  '[NMBS] Get stations',
  props<
    {
      stationId: string;
    } & ActionBase<{
      stationId: string;
      departures: NMBSDeparture[];
    }>
  >()
);
export const getNMBSDeparturesResolved: ActionCreator<
  '[NMBS] Get stations resolved',
  (props: { stationId: string; departures: NMBSDeparture[] }) => {
    stationId: string;
    departures: NMBSDeparture[];
  } & Action
> = createAction(
  '[NMBS] Get stations resolved',
  props<{
    stationId: string;
    departures: NMBSDeparture[];
  }>()
);
