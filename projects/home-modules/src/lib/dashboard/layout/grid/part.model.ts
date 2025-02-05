import { ComponentType } from '@angular/cdk/portal';
import { AbstractComponent } from '../../components/abstract.component';
import { PartType, PartTypeDefaults, PartTypes } from '../../part.types';

export class Part {
  id!: string;
  typeName!: PartType;
  private _type!: ComponentType<AbstractComponent>;

  get type() {
    if (this._type) return this._type;
    return PartTypes()[this.typeName].type;
  }

  x = 0;
  y = 0;
  width = 2;
  height = 2;

  config!: { [key: string]: any };

  constructor(obj: Partial<Part | PartCookie>) {
    Object.assign(this, obj);
    if (!obj.config) this.config = PartTypeDefaults[obj.typeName as PartType];
  }
}

export class PartCookie {
  id!: string;
  typeName!: string;

  x!: number;
  y!: number;
  width!: number;
  height!: number;

  config?: { [key: string]: any };
}

export const PartCookieMapper: (p: Part) => PartCookie = (p: Part) => ({
  id: p.id,
  typeName: p.typeName,
  x: p.x,
  y: p.y,
  width: p.width,
  height: p.height,
  config: p.config,
});
