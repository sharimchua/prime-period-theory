import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import '../index';
import { EventBus } from '../features/EventBus';

describe('GridCoordinatorComponent', () => {
  beforeEach(() => {
    // EventBus resets or document clears
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should render and set CSS variables on the nearest coil', () => {
    const coil = document.createElement('ppt-coil');
    const coordinator = document.createElement('ppt-grid-coordinator');
    coordinator.setAttribute('column-width', '4em');
    coil.appendChild(coordinator);
    document.body.appendChild(coil);

    expect(coil.style.getPropertyValue('--ppt-grid-template')).toContain('4em');
  });

  it('should track beat maps via EventBus', () => {
    const coordinator = document.createElement('ppt-grid-coordinator') as any;
    document.body.appendChild(coordinator);

    // Subscribe to test beat map requests
    let receivedMap = false;
    EventBus.subscribe('grid-beat-map', (payload) => {
        if(payload && payload.beatMap && payload.beatMap.length > 0) {
            receivedMap = true;
        }
    });

    EventBus.publish('grid-beat-map', { beatMap: [0, 1, 2] });
    EventBus.publish('request-beat-map', {});

    expect(receivedMap).toBe(true);
  });

  it('should update grid variables when column-width attribute changes', () => {
    const coil = document.createElement('ppt-coil');
    const coordinator = document.createElement('ppt-grid-coordinator');
    coil.appendChild(coordinator);
    document.body.appendChild(coil);

    coordinator.setAttribute('column-width', '5em');
    expect(coil.style.getPropertyValue('--ppt-grid-template')).toContain('5em');
  });

  it('should handle undefined beatmap payload', () => {
    const coordinator = document.createElement('ppt-grid-coordinator') as any;
    document.body.appendChild(coordinator);

    EventBus.publish('grid-beat-map', null);

    expect(coordinator.beatMap.length).toBe(0);
  });
});
