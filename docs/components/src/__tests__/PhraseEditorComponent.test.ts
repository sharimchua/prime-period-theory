import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import '../PhraseEditorComponent.js';
import { EventBus } from '../features/EventBus.js';

describe('PhraseEditorComponent', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.spyOn(EventBus, 'subscribe');
    vi.spyOn(EventBus, 'unsubscribe');
    vi.spyOn(EventBus, 'publish');
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('should render correctly initially', async () => {
    const el = document.createElement('ppt-phrase-editor') as any;
    document.body.appendChild(el);
    await new Promise(r => setTimeout(r, 0));

    expect(el.shadowRoot.innerHTML).toContain('Click to edit');
    expect(EventBus.subscribe).toHaveBeenCalledWith('glyph-input', expect.any(Function));
    expect(EventBus.subscribe).toHaveBeenCalledWith('active-phrase-editor-changed', expect.any(Function));
    expect(EventBus.subscribe).toHaveBeenCalledWith('grid-beat-map', expect.any(Function));
    expect(EventBus.publish).toHaveBeenCalledWith('request-beat-map', {});
  });

  it('should handle focus and active editor changes', async () => {
    const el = document.createElement('ppt-phrase-editor') as any;
    document.body.appendChild(el);
    await new Promise(r => setTimeout(r, 0));

    el.focus();

    expect(el.isActiveEditor).toBe(true);
    expect(EventBus.publish).toHaveBeenCalledWith('layer-focus-changed', { layerType: 'melody' });
    expect(EventBus.publish).toHaveBeenCalledWith('active-phrase-editor-changed', expect.objectContaining({ editor: el }));
    expect(el.classList.contains('active-editor')).toBe(true);

    // Simulate another editor becoming active
    const handleActiveEditorChanged = (el as any).handleActiveEditorChanged;
    handleActiveEditorChanged({ editor: document.createElement('ppt-phrase-editor') });

    expect(el.isActiveEditor).toBe(false);
    expect(el.classList.contains('active-editor')).toBe(false);
  });

  it('should update on glyph input when active', async () => {
    const el = document.createElement('ppt-phrase-editor') as any;
    document.body.appendChild(el);
    await new Promise(r => setTimeout(r, 0));

    el.focus();
    const handleGlyphInput = (el as any).handleGlyphInput;

    handleGlyphInput({
      type: 'phrase',
      tokens: [{ type: 'glyph', solfege: 'Do', raw: 'Do' }],
      text: 'Do'
    });

    expect(el.tokens.length).toBe(1);
    expect(el.rawText).toBe('Do');
    expect(el.shadowRoot.innerHTML).toContain('ppt-uniform-solfege');
  });

  it('should not update on glyph input when not active', async () => {
    const el = document.createElement('ppt-phrase-editor') as any;
    document.body.appendChild(el);
    await new Promise(r => setTimeout(r, 0));

    const handleGlyphInput = (el as any).handleGlyphInput;

    handleGlyphInput({
      type: 'phrase',
      tokens: [{ type: 'glyph', solfege: 'Do', raw: 'Do' }],
      text: 'Do'
    });

    expect(el.tokens.length).toBe(0);
    expect(el.rawText).toBe('');
  });
});
