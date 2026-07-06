import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { PlayalongPresetsComponent } from '../PlayalongPresetsComponent.js';
import { EventBus } from '../../features/EventBus.js';
import { Window } from 'happy-dom';

describe('PlayalongPresetsComponent', () => {
  let element: PlayalongPresetsComponent;

  beforeEach(() => {
    vi.spyOn(EventBus, 'publish').mockImplementation(() => {});
    document.body.innerHTML = '';
    element = document.createElement('ppt-playalong-presets') as PlayalongPresetsComponent;
    document.body.appendChild(element);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render the component structure', () => {
    const shadow = element.shadowRoot;
    expect(shadow).toBeTruthy();
    expect(shadow!.querySelector('.presets-title')).toBeTruthy();
    expect(shadow!.getElementById('btn-full')).toBeTruthy();
    expect(shadow!.getElementById('btn-solo-melody')).toBeTruthy();
    expect(shadow!.getElementById('btn-solo-harmony')).toBeTruthy();
    expect(shadow!.getElementById('btn-solo-rhythm')).toBeTruthy();
  });

  it('should publish mixer-batch-update with reset action on btn-full click', () => {
    const shadow = element.shadowRoot;
    const btn = shadow!.getElementById('btn-full');
    btn?.click();
    expect(EventBus.publish).toHaveBeenCalledWith('mixer-batch-update', { action: 'reset' });
  });

  it('should publish mixer-batch-update with solo-layer melody on btn-solo-melody click', () => {
    const shadow = element.shadowRoot;
    const btn = shadow!.getElementById('btn-solo-melody');
    btn?.click();
    expect(EventBus.publish).toHaveBeenCalledWith('mixer-batch-update', { action: 'solo-layer', layer: 'melody' });
  });

  it('should publish mixer-batch-update with solo-layer harmony on btn-solo-harmony click', () => {
    const shadow = element.shadowRoot;
    const btn = shadow!.getElementById('btn-solo-harmony');
    btn?.click();
    expect(EventBus.publish).toHaveBeenCalledWith('mixer-batch-update', { action: 'solo-layer', layer: 'harmony' });
  });

  it('should publish mixer-batch-update with solo-layer rhythm on btn-solo-rhythm click', () => {
    const shadow = element.shadowRoot;
    const btn = shadow!.getElementById('btn-solo-rhythm');
    btn?.click();
    expect(EventBus.publish).toHaveBeenCalledWith('mixer-batch-update', { action: 'solo-layer', layer: 'rhythm' });
  });

  it('has componentDef', () => {
    const def = PlayalongPresetsComponent.componentDef;
    expect(def.displayName).toBe('Play-Along Presets');
    expect(def.canNestIn).toContain('ppt-container');
  });
});
