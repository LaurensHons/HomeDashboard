import { v4 } from 'uuid';

export class ButtonAction {
  id = v4();
  icon?: string;
  displayName!: string;
  routerLink?: string;
  onClick?: () => void;

  constructor(obj: Partial<ButtonAction>) {
    Object.assign(this, obj);
  }
}
