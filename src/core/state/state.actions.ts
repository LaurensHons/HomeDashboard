import { createAction, props } from '@ngrx/store';
import { ActionBase } from './action-base.interface';
import { NMBSDeparture, NMBSStation } from '../models/nmbs.models';

export const getNMBSStations = createAction(
  '[NMBS] Get stations',
  props<{
    callback?: (success: boolean) => void;
  }>()
);
export const getNMBSStationsResolved = createAction(
  '[NMBS] Get stations resolved',
  props<{
    stations: NMBSStation[];
  }>()
);

export const getNMBSDepartures = createAction(
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
export const getNMBSDeparturesResolved = createAction(
  '[NMBS] Get stations resolved',
  props<{
    stationId: string;
    departures: NMBSDeparture[];
  }>()
);
