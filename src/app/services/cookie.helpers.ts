import { v4 } from 'uuid';
import { Part } from '../layout/grid/grid.component';

type EnumDictionary<T extends string | symbol | number, U> = {
  [K in T]: U;
};

export enum CookieKey {
  DashboardSavedPartKey = 'DASHBOARD_SAVED_PARTS',
  DashboardDarkMode = 'DASHBOARD_DARK_MODE',
}

export const CookieDefaults: { [key in CookieKey]: any } = {
  [CookieKey.DashboardDarkMode]: false,
  [CookieKey.DashboardSavedPartKey]: [
    new Part({ id: v4(), typeName: 'nmbs', y: 2, width: 2, height: 2 }),
    //new Part('buienradar', B, { y: 2, width: 2, height: 2 }),
    new Part({
      id: v4(),
      typeName: 'buiengraph',
      x: 2,
      y: 2,
      width: 4,
      height: 2,
    }),
  ],
};

export class PartCookie {
  id!: string;
  typeName!: string;
  x!: number;
  y!: number;
  width!: number;
  height!: number;
}

export const PartCookieMapper: (p: Part) => PartCookie = (p: Part) => ({
  id: p.id,
  typeName: p.typeName,
  x: p.x,
  y: p.y,
  width: p.width,
  height: p.height,
});
