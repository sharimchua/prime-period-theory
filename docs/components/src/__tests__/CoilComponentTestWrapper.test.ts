import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { CoilComponent } from '../CoilComponent.js';
import { EventBus } from '../features/EventBus.js';

class TestCoil extends CoilComponent {}

describe('CoilComponent', () => {
  beforeEach(() => {
    if (!customElements.get('test-coil')) {
      customElements.define('test-coil', TestCoil);
    }
    vi.useFakeTimers();
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('should handle navigation events and layer edits via EventBus', async () => {
    const coil = document.createElement('test-coil') as any;
    document.body.appendChild(coil);

    // 1. onActiveEditorChanged
    const fakeEditor = document.createElement('ppt-phrase-editor');
    EventBus.publish('active-phrase-editor-changed', { editor: fakeEditor });
    expect(coil.activeEditor).toBe(fakeEditor);

    // Create a DOM structure for testing nav and layers
    const layer = document.createElement('ppt-coil-layer');

    const row1 = document.createElement('ppt-coil-row');
    const editor1 = document.createElement('ppt-phrase-editor');
    editor1.focus = vi.fn();
    row1.appendChild(editor1);

    const row2 = document.createElement('ppt-coil-row');
    const editor2 = document.createElement('ppt-phrase-editor');
    editor2.focus = vi.fn();
    row2.appendChild(editor2);

    layer.appendChild(row1);
    layer.appendChild(row2);
    coil.appendChild(layer);

    // 2. onNavUp
    EventBus.publish('active-phrase-editor-changed', { editor: editor2 });
    EventBus.publish('coil-nav-up', {});
    expect(editor1.focus).toHaveBeenCalled();

    // 3. onNavDown
    EventBus.publish('active-phrase-editor-changed', { editor: editor1 });
    EventBus.publish('coil-nav-down', {});
    expect(editor2.focus).toHaveBeenCalled();

    // 4. onLayerAdd
    EventBus.publish('active-phrase-editor-changed', { editor: editor1 });
    EventBus.publish('coil-layer-add', {});
    // It should add a row after
    vi.runAllTimers();
    expect(layer.querySelectorAll('ppt-coil-row').length).toBe(3);

    // 5. onLayerDelete (more than 1 row)
    EventBus.publish('active-phrase-editor-changed', { editor: editor1 });
    EventBus.publish('coil-layer-delete', {});
    expect(layer.querySelectorAll('ppt-coil-row').length).toBe(2);
    expect(editor2.focus).toHaveBeenCalledTimes(2); // Second time from layer delete focus next

    // 6. onLayerDelete (only 1 row)
    layer.removeChild(row2);
    const publishSpy = vi.spyOn(EventBus, 'publish');
    EventBus.publish('active-phrase-editor-changed', { editor: layer.querySelector('ppt-phrase-editor') });
    EventBus.publish('coil-layer-delete', {});

    expect(publishSpy).toHaveBeenCalledWith('coil-glyph-input', { type: 'phrase', text: '', tokens: [] });
  });

  it('should ignore events if no active editor', () => {
    const coil = document.createElement('test-coil') as any;
    document.body.appendChild(coil);

    EventBus.publish('active-phrase-editor-changed', { editor: null });

    expect(() => {
      EventBus.publish('coil-nav-up', {});
      EventBus.publish('coil-nav-down', {});
      EventBus.publish('coil-layer-add', {});
      EventBus.publish('coil-layer-delete', {});
    }).not.toThrow();
  });

  it('should disconnect event listeners', () => {
    const coil = document.createElement('test-coil') as any;
    document.body.appendChild(coil);

    const unsubscribeSpy = vi.spyOn(EventBus, 'unsubscribe');
    coil.disconnectedCallback();

    expect(unsubscribeSpy).toHaveBeenCalledWith('active-phrase-editor-changed', expect.any(Function));
    expect(unsubscribeSpy).toHaveBeenCalledWith('coil-nav-up', expect.any(Function));
    expect(unsubscribeSpy).toHaveBeenCalledWith('coil-nav-down', expect.any(Function));
    expect(unsubscribeSpy).toHaveBeenCalledWith('coil-layer-add', expect.any(Function));
    expect(unsubscribeSpy).toHaveBeenCalledWith('coil-layer-delete', expect.any(Function));
  });
});
