import { Type } from '@angular/core';
import { BuienRadarConfigComponent } from '../../components/buien-radar/buien-radar-config/buien-radar-config.component';
import { BuienRadarComponent } from '../../components/buien-radar/buien-radar.component';
import { BuienradarGraphComponent } from '../../components/buienradar-graph/buienradar-graph.component';
import { NmbsComponent } from '../../components/nmbs/nmbs.component';
import { ComponentType } from '@angular/cdk/portal';
import { AbstractConfigComponent } from '../../components/abstract.config.component';

export enum PartType {
  buienradar = 'buienradar',
  buiengraph = 'buiengraph',
  nmbs = 'nmbs',
}

export const PartTypeDefaults: { [key in PartType]: any } = {
  [PartType.buienradar]: { automaticLocationEnabled: true, lon: 0, lat: 0 },
  [PartType.buiengraph]: undefined,
  [PartType.nmbs]: undefined,
};

export const PartTypes: () => {
  [x in PartType]: {
    displayName: string;
    type: Type<any>;
    configType?: ComponentType<AbstractConfigComponent>;
  };
} = () => {
  return {
    buienradar: {
      displayName: 'Buien Radar',
      type: BuienRadarComponent,
      configType: BuienRadarConfigComponent,
    },
    buiengraph: {
      displayName: 'Buien Graph',
      type: BuienradarGraphComponent,
    },
    nmbs: {
      displayName: 'NMBS station viewer',
      type: NmbsComponent,
    },
  };
};
