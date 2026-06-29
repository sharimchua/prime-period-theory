import { CustomElement } from './features/WithInteractive.js';
import { EventBus } from './features/EventBus.js';

export class EventBindingComponent extends HTMLElement implements CustomElement {
  private _boundListener = this._handleEventMessage.bind(this);

  static get componentDef() {
    return {
      displayName: 'Event Binding',
      familyColor: '#f39c12',
      acceptsChildren: [],
      canNestIn: ['*']
    };
  }

  static get observedAttributes() {
    return ['listen-id', 'target-attr', 'value-true', 'value-false'];
  }

  static get pptMetadata() {
    return {
      'listen-id': { type: 'string', default: '', description: 'The EventBus ID to listen to.' },
      'target-attr': { type: 'string', default: '', description: 'The attribute on the parent element to mutate.' },
      'value-true': { type: 'string', default: '', description: 'If set, maps a truthy value to this string before setting the attribute.' },
      'value-false': { type: 'string', default: '', description: 'If set, maps a falsy value to this string before setting the attribute.' }
    };
  }

  get listenId() {
    return this.getAttribute('listen-id') || '';
  }

  set listenId(val: string) {
    this.setAttribute('listen-id', val);
  }

  get targetAttr() {
    return this.getAttribute('target-attr') || '';
  }

  set targetAttr(val: string) {
    this.setAttribute('target-attr', val);
  }

  connectedCallback() {
    this.style.display = 'none'; // Ensure it is invisible
    this._updateSubscription(this.listenId);
  }

  disconnectedCallback() {
    if (this._currentListenId) {
      EventBus.unsubscribe(this._currentListenId, this._boundListener);
    }
  }

  attributeChangedCallback(name: string, _oldValue: string, newValue: string) {
    if (name === 'listen-id') {
      this._updateSubscription(newValue);
    }
  }

  private _currentListenId: string = '';

  private _updateSubscription(newId: string | null) {
    if (this._currentListenId) {
      EventBus.unsubscribe(this._currentListenId, this._boundListener);
    }
    this._currentListenId = newId || '';
    if (this._currentListenId) {
      EventBus.subscribe(this._currentListenId, this._boundListener);
    }
  }

  private _handleEventMessage(value: any) {
    if (!this.targetAttr) return;

    // Apply value mapping if configured (e.g. boolean control → enum attribute)
    const valueTrue = this.getAttribute('value-true');
    const valueFalse = this.getAttribute('value-false');

    let finalValue: string;
    if (valueTrue !== null && valueFalse !== null) {
      const isTruthy = value === true || value === 'true' || value === 1 || value === '1';
      finalValue = isTruthy ? valueTrue : valueFalse;
    } else {
      finalValue = String(value);
    }

    const parent = this.parentElement;
    if (parent) {
      parent.setAttribute(this.targetAttr, finalValue);
    }
  }
}

customElements.define('ppt-event-binding', EventBindingComponent);
