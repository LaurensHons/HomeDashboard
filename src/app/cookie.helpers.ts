import { Part } from './components/grid/grid.component';

export const DashboardSavedPartKey = 'DASHBOARD_SAVED_PARTS';
export class PartCookie {
  name!: string;
  id!: string;
  x!: number;
  y!: number;
  width!: number;
  height!: number;
}
export const PartCookieMapper: (p: Part) => PartCookie = (p: Part) => ({
  name: p.name,
  ...p.pos,
});
