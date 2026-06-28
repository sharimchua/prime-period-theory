import { CustomElement } from './WithInteractive.js';
type Constructor<T = CustomElement> = new (...args: any[]) => T;

export interface HiddenElement extends HTMLElement {
  isHiddenComponent: boolean;
}

export function WithHidden<TBase extends Constructor<HTMLElement>>(Base: TBase) {
  return class extends Base implements HiddenElement {
    get isHiddenComponent() {
      return true;
    }
  };
}
