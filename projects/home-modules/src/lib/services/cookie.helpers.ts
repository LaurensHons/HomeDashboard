import { v4 } from 'uuid';
import { PartType } from '../dashboard/part.types';
import { Part } from '../dashboard/layout/grid/part.model';

export enum CookieKey {
  DashboardSavedPartKey = 'DASHBOARD_SAVED_PARTS',
  DashboardNMBSFAVORITES = 'DASHBOARD_NMBS_FAVORITES',
  DashboardDarkMode = 'DASHBOARD_DARK_MODE',
}

export enum LocalStorageKey {
  DashboardNMBSSTATIONCACHE = 'DASHBOARD_NMBS_STATION_CACHE',
}

export const CookieDefaults: { [key in CookieKey]: any } = {
  [CookieKey.DashboardDarkMode]: false,
  [CookieKey.DashboardNMBSFAVORITES]: [],
  [CookieKey.DashboardSavedPartKey]: [
    new Part({
      id: v4(),
      typeName: PartType.buiengraph,
      x: 2,
      y: 0,
      width: 4,
      height: 2,
    }),
    //new Part('buienradar', B, { y: 2, width: 2, height: 2 }),
    new Part({
      id: v4(),
      typeName: PartType.buienradar,
      width: 2,
      height: 2,
      x: 0,
      y: 0,
    }),
  ],
};
