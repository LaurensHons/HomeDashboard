export abstract class AbstractComponent {
  static CONFIG_COMPONENT?: new () => AbstractComponent;
  id?: string;
}
