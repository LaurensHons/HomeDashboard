import { v4 } from 'uuid';
import { Part } from '../layout/grid/part.model';
import { PartType } from '../pages/dashboard/part.types';

export enum CookieKey {
  DashboardSavedPartKey = 'DASHBOARD_SAVED_PARTS',
  DashboardDarkMode = 'DASHBOARD_DARK_MODE',
}

export const CookieDefaults: { [key in CookieKey]: any } = {
  [CookieKey.DashboardDarkMode]: false,
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
