import { v4 } from 'uuid';
import { PartType } from '../dashboard/part.types';
import { Part } from '../dashboard/layout/grid/part.model';

export enum CookieKey {
  DashboardSavedPartKey = 'DASHBOARD_SAVED_PARTS',
  DashboardNMBSSTATIONCACHE = 'DASHBOARD_NMBS_STATION_CACHE',
  DashboardNMBSFAVORITES = 'DASHBOARD_NMBS_FAVORITES',
  DashboardDarkMode = 'DASHBOARD_DARK_MODE',
}

export const CookieDefaults: { [key in CookieKey]: any } = {
  [CookieKey.DashboardDarkMode]: false,
  [CookieKey.DashboardNMBSSTATIONCACHE]: [],
  [CookieKey.DashboardNMBSFAVORITES]: [],
  [CookieKey.DashboardSavedPartKey]: [
    new Part({
      id: v4(),
      typeName: PartType.buiengraph,
      x: 2,
      width: 4,
      height: 2,
    }),
    //new Part('buienradar', B, { y: 2, width: 2, height: 2 }),
    new Part({
      id: v4(),
      typeName: PartType.buienradar,
      width: 4,
      height: 2,
    }),
  ],
};
