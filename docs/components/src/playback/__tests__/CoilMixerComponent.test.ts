import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { CoilMixerComponent } from '../CoilMixerComponent.js';
import { EventBus } from '../../features/EventBus.js';

// Minimal mock for components to allow child queries
class MockLayer extends HTMLElement {}
class MockRow extends HTMLElement {}
if (!customElements.get('ppt-coil-layer')) customElements.define('ppt-coil-layer', MockLayer);
if (!customElements.get('ppt-coil-row')) customElements.define('ppt-coil-row', MockRow);


describe('CoilMixerComponent', () => {
  let element: CoilMixerComponent;

  beforeEach(() => {
    vi.spyOn(EventBus, 'publish').mockImplementation(() => {});
    document.body.innerHTML = '';
    element = document.createElement('ppt-coil-mixer') as CoilMixerComponent;
    document.body.appendChild(element);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialize and render', () => {
    expect(element.shadowRoot).toBeTruthy();
    expect(element.shadowRoot!.querySelector('.mixer-wrapper')).toBeTruthy();
  });

  it('should add headers to rows and setup initial mutes', async () => {
    // We add some child layers and rows
    element.innerHTML = `
      <ppt-coil-layer layer="melody" muted>
        <ppt-coil-row></ppt-coil-row>
      </ppt-coil-layer>
      <ppt-coil-layer layer="harmony">
        <ppt-coil-row></ppt-coil-row>
      </ppt-coil-layer>
    `;

    // connectedCallback's setTimeout does initial sync
    await new Promise(r => setTimeout(r, 10));

    const rows = element.querySelectorAll('ppt-coil-row');
    expect(rows.length).toBe(2);

    // Should have created headers
    const header0 = rows[0].querySelector('.mixer-track-header');
    expect(header0).toBeTruthy();
    const header1 = rows[1].querySelector('.mixer-track-header');
    expect(header1).toBeTruthy();

    // The first layer was muted
    expect(EventBus.publish).toHaveBeenCalledWith('mixer-mute', { layer: 'melody', rowIndex: 0, active: true });
    expect(header0?.querySelector('.mute-btn')?.classList.contains('active')).toBe(true);
  });

  it('should toggle mute on click', async () => {
    element.innerHTML = `
      <ppt-coil-layer layer="rhythm">
        <ppt-coil-row></ppt-coil-row>
      </ppt-coil-layer>
    `;

    await new Promise(r => setTimeout(r, 10));

    const row = element.querySelector('ppt-coil-row');
    const muteBtn = row?.querySelector('.mute-btn') as HTMLButtonElement;

    // initially not active
    expect(muteBtn.classList.contains('active')).toBe(false);

    // click to mute
    muteBtn.click();
    expect(EventBus.publish).toHaveBeenCalledWith('mixer-mute', { layer: 'rhythm', rowIndex: 0, active: true });
    expect(muteBtn.classList.contains('active')).toBe(true);

    // click to unmute
    muteBtn.click();
    expect(EventBus.publish).toHaveBeenCalledWith('mixer-mute', { layer: 'rhythm', rowIndex: 0, active: false });
    expect(muteBtn.classList.contains('active')).toBe(false);
  });

  it('should toggle solo on click and turn off mute if active', async () => {
    element.innerHTML = `
      <ppt-coil-layer layer="rhythm">
        <ppt-coil-row></ppt-coil-row>
      </ppt-coil-layer>
    `;

    await new Promise(r => setTimeout(r, 10));

    const row = element.querySelector('ppt-coil-row');
    const muteBtn = row?.querySelector('.mute-btn') as HTMLButtonElement;
    const soloBtn = row?.querySelector('.solo-btn') as HTMLButtonElement;

    // mute first
    muteBtn.click();
    expect(muteBtn.classList.contains('active')).toBe(true);

    // click solo -> should deactivate mute
    soloBtn.click();
    expect(EventBus.publish).toHaveBeenCalledWith('mixer-solo', { layer: 'rhythm', rowIndex: 0, active: true });
    expect(EventBus.publish).toHaveBeenCalledWith('mixer-mute', { layer: 'rhythm', rowIndex: 0, active: false });

    expect(soloBtn.classList.contains('active')).toBe(true);
    expect(muteBtn.classList.contains('active')).toBe(false);

    // click solo again
    soloBtn.click();
    expect(EventBus.publish).toHaveBeenCalledWith('mixer-solo', { layer: 'rhythm', rowIndex: 0, active: false });
    expect(soloBtn.classList.contains('active')).toBe(false);
  });

  it('should handle mixer-batch-update solo-layer', async () => {
    element.innerHTML = `
      <ppt-coil-layer layer="melody">
        <ppt-coil-row></ppt-coil-row>
      </ppt-coil-layer>
      <ppt-coil-layer layer="harmony">
        <ppt-coil-row></ppt-coil-row>
      </ppt-coil-layer>
    `;
    await new Promise(r => setTimeout(r, 10));

    EventBus.publish('mixer-batch-update', { action: 'solo-layer', layer: 'melody' });

    // Mock the handling by calling it since we mocked publish
    (element as any).onBatchUpdate({ action: 'solo-layer', layer: 'melody' });

    const rows = element.querySelectorAll('ppt-coil-row');
    expect(rows[0].querySelector('.solo-btn')?.classList.contains('active')).toBe(true);
    expect(rows[1].querySelector('.solo-btn')?.classList.contains('active')).toBe(false);

    expect(EventBus.publish).toHaveBeenCalledWith('mixer-solo', { layer: 'melody', rowIndex: 0, active: true });
    expect(EventBus.publish).toHaveBeenCalledWith('mixer-mute', { layer: 'harmony', rowIndex: 0, active: false });
  });

  it('should handle mixer-batch-update reset', async () => {
    element.innerHTML = `
      <ppt-coil-layer layer="melody">
        <ppt-coil-row></ppt-coil-row>
      </ppt-coil-layer>
    `;
    await new Promise(r => setTimeout(r, 10));

    // make it soloed first
    const soloBtn = element.querySelector('.solo-btn') as HTMLButtonElement;
    soloBtn.click();
    expect(soloBtn.classList.contains('active')).toBe(true);

    (element as any).onBatchUpdate({ action: 'reset' });

    expect(soloBtn.classList.contains('active')).toBe(false);
    expect(EventBus.publish).toHaveBeenCalledWith('mixer-solo', { layer: 'melody', rowIndex: 0, active: false });
    expect(EventBus.publish).toHaveBeenCalledWith('mixer-mute', { layer: 'melody', rowIndex: 0, active: false });
  });

  it('has componentDef', () => {
    const def = CoilMixerComponent.componentDef;
    expect(def.displayName).toBe('Coil Mixer');
    expect(def.acceptsChildren).toContain('ppt-coil');
  });
});
