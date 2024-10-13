import { Type } from '@angular/core';
import { BuienRadarConfigComponent } from '../../components/buien-radar/buien-radar-config/buien-radar-config.component';
import { BuienRadarComponent } from '../../components/buien-radar/buien-radar.component';
import { BuienradarGraphComponent } from '../../components/buienradar-graph/buienradar-graph.component';
import { NmbsComponent } from '../../components/nmbs/nmbs.component';
import { ComponentType } from '@angular/cdk/portal';
import { AbstractConfigComponent } from '../../components/abstract.config.component';
import { AbstractComponent } from '../../components/abstract.component';
import { WebsiteComponent } from '../../components/website/website.component';
import { WebsiteConfigComponent } from '../../components/website/website-config/website-config.component';

export enum PartType {
  buienradar = 'buienradar',
  buiengraph = 'buiengraph',
  nmbs = 'nmbs',
  website = 'website',
}

export const PartTypeDefaults: { [key in PartType]: any } = {
  [PartType.buienradar]: { automaticLocationEnabled: true, lon: 0, lat: 0 },
  [PartType.buiengraph]: undefined,
  [PartType.nmbs]: undefined,
  [PartType.website]: { src: '' },
};

export const PartTypes: () => {
  [x in PartType]: {
    displayName: string;
    type: ComponentType<AbstractComponent>;
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
    website: {
      displayName: 'Website',
      type: WebsiteComponent,
      configType: WebsiteConfigComponent,
    },
  };
};
