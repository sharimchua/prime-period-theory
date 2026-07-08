import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import '../index';
import { EventBus } from '../features/EventBus';

describe('Coil Components', () => {
  beforeEach(() => {
    // Clear custom elements if needed, but vitest DOM is usually clean per test file
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should render ppt-coil', () => {
    const el = document.createElement('ppt-coil');
    document.body.appendChild(el);
    expect(el.shadowRoot).not.toBeNull();
  });

  it('should render ppt-coil-layer with specific layer attribute', () => {
    const el = document.createElement('ppt-coil-layer');
    el.setAttribute('layer', 'melody');
    document.body.appendChild(el);
    
    expect(el.shadowRoot?.innerHTML).toContain('melody Layer');
  });

  it('should render ppt-coil-row', () => {
    const el = document.createElement('ppt-coil-row');
    document.body.appendChild(el);
    expect(el.shadowRoot).not.toBeNull();
  });

  it('should render ppt-coil-cursor', () => {
    const el = document.createElement('ppt-coil-cursor');
    document.body.appendChild(el);
    expect(el.shadowRoot).not.toBeNull();
  });

  describe('CoilRowComponent', () => {
    it('should have correct componentDef', () => {
      const el = document.createElement('ppt-coil-row') as any;
      expect(el.constructor.componentDef.displayName).toBe('Coil Row');
    });

    it('should call attributeChangedCallback correctly', () => {
      const el = document.createElement('ppt-coil-row') as any;
      document.body.appendChild(el);
      // Set the attribute to test base implementation
      el.setAttribute('id', 'test');
      el.attributeChangedCallback('id', null, 'test');
      expect(el.id).toBe('test');
    });
  });

  describe('CoilLayerComponent', () => {
    it('should have correct componentDef and metadata', () => {
      const el = document.createElement('ppt-coil-layer') as any;
      expect(el.constructor.componentDef.displayName).toBe('Coil Layer');
      expect(el.constructor.pptMetadata.layer).toBeDefined();
    });

    it('should update layer colors when layer attribute changes', () => {
      const el = document.createElement('ppt-coil-layer');
      document.body.appendChild(el);

      // Default is rhythm -> #94a3b8
      expect(el.style.getPropertyValue('--layer-color')).toBe('#94a3b8');

      el.setAttribute('layer', 'harmony');
      expect(el.style.getPropertyValue('--layer-color')).toBe('#fbbf24');

      el.setAttribute('layer', 'melody');
      expect(el.style.getPropertyValue('--layer-color')).toBe('#60a5fa');
    });

    it('should add a new row when add-row button is clicked', () => {
      const el = document.createElement('ppt-coil-layer');
      document.body.appendChild(el);

      const addBtn = el.shadowRoot?.querySelector('.add-row') as HTMLElement;
      expect(addBtn).not.toBeNull();

      const initialRowCount = el.querySelectorAll('ppt-coil-row').length;
      expect(initialRowCount).toBe(0);

      addBtn.click();

      const newRowCount = el.querySelectorAll('ppt-coil-row').length;
      expect(newRowCount).toBe(1);

      const addedRow = el.querySelector('ppt-coil-row');
      expect(addedRow?.innerHTML).toContain('ppt-phrase-editor');
    });
  });

  describe('CoilCursorComponent', () => {
    it('should have correct componentDef', () => {
      const el = document.createElement('ppt-coil-cursor') as any;
      expect(el.constructor.componentDef.displayName).toBe('Coil Cursor');
    });
  });

  describe('CoilComponent', () => {
    it('should have correct componentDef', () => {
      const el = document.createElement('ppt-coil') as any;
      expect(el.constructor.componentDef.displayName).toBe('Coil');
    });

    it('should track active editor via active-phrase-editor-changed', () => {
      const coil = document.createElement('ppt-coil');
      document.body.appendChild(coil);

      const mockEditor = document.createElement('ppt-phrase-editor');

      EventBus.publish('active-phrase-editor-changed', { editor: mockEditor });
      expect((coil as any).activeEditor).toBe(mockEditor);
    });

    it('should navigate up and down between editors', () => {
      const coil = document.createElement('ppt-coil');
      document.body.appendChild(coil);

      const editor1 = document.createElement('ppt-phrase-editor') as any;
      const editor2 = document.createElement('ppt-phrase-editor') as any;
      const editor3 = document.createElement('ppt-phrase-editor') as any;

      editor1.focus = vi.fn();
      editor2.focus = vi.fn();
      editor3.focus = vi.fn();

      coil.appendChild(editor1);
      coil.appendChild(editor2);
      coil.appendChild(editor3);

      EventBus.publish('active-phrase-editor-changed', { editor: editor2 });

      EventBus.publish('coil-nav-up', {});
      expect(editor1.focus).toHaveBeenCalled();

      EventBus.publish('coil-nav-down', {});
      expect(editor3.focus).toHaveBeenCalled();
    });

    it('should handle coil-layer-add by adding a row to the active layer', async () => {
      const coil = document.createElement('ppt-coil');
      document.body.appendChild(coil);

      const layer = document.createElement('ppt-coil-layer');
      coil.appendChild(layer);

      const row = document.createElement('ppt-coil-row');
      layer.appendChild(row);

      const editor = document.createElement('ppt-phrase-editor');
      row.appendChild(editor);

      EventBus.publish('active-phrase-editor-changed', { editor: editor });

      const initialRowCount = layer.querySelectorAll('ppt-coil-row').length;
      expect(initialRowCount).toBe(1);

      EventBus.publish('coil-layer-add', {});

      // Wait for focus timeout
      await new Promise(r => setTimeout(r, 60));

      const newRowCount = layer.querySelectorAll('ppt-coil-row').length;
      expect(newRowCount).toBe(2);
    });

    it('should handle coil-layer-delete by removing the active row if there are multiple', () => {
      const coil = document.createElement('ppt-coil');
      document.body.appendChild(coil);

      const layer = document.createElement('ppt-coil-layer');
      coil.appendChild(layer);

      const row1 = document.createElement('ppt-coil-row');
      const editor1 = document.createElement('ppt-phrase-editor') as any;
      editor1.focus = vi.fn();
      row1.appendChild(editor1);
      layer.appendChild(row1);

      const row2 = document.createElement('ppt-coil-row');
      const editor2 = document.createElement('ppt-phrase-editor') as any;
      editor2.focus = vi.fn();
      row2.appendChild(editor2);
      layer.appendChild(row2);

      // Set active to editor 1
      EventBus.publish('active-phrase-editor-changed', { editor: editor1 });

      EventBus.publish('coil-layer-delete', {});

      // row1 should be deleted, editor2 should be focused
      expect(layer.querySelectorAll('ppt-coil-row').length).toBe(1);
      expect(editor2.focus).toHaveBeenCalled();
    });

    it('should clear the active row text if it is the only row when deleting', () => {
      const coil = document.createElement('ppt-coil');
      document.body.appendChild(coil);

      const layer = document.createElement('ppt-coil-layer');
      coil.appendChild(layer);

      const row1 = document.createElement('ppt-coil-row');
      const editor1 = document.createElement('ppt-phrase-editor') as any;
      row1.appendChild(editor1);
      layer.appendChild(row1);

      EventBus.publish('active-phrase-editor-changed', { editor: editor1 });

      let receivedPayload: any = null;
      const subId = EventBus.subscribe('coil-glyph-input', (p) => receivedPayload = p);

      EventBus.publish('coil-layer-delete', {});

      // Row should still be there
      expect(layer.querySelectorAll('ppt-coil-row').length).toBe(1);

      // EventBus should have published empty text
      expect(receivedPayload).not.toBeNull();
      expect(receivedPayload.text).toBe('');

      EventBus.unsubscribe('coil-glyph-input', subId as any);
    });
  });
});

describe('PhraseEditorComponent', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should render and accept tokens via EventBus when focused', async () => {
    const el = document.createElement('ppt-phrase-editor') as any;
    document.body.appendChild(el);
    
    // Simulate focus
    el.focus();
    
    // Wait for microtasks so EventBus subscription resolves focus
    await Promise.resolve();
    
    // Emit token as a phrase payload
    EventBus.publish('glyph-input', { 
      type: 'phrase', 
      text: 'ReSub', 
      tokens: [{ type: 'glyph', solfege: 'Re', diacritic: 'w_tri' }] 
    });
    
    // Wait for microtasks
    await Promise.resolve();
    
    expect(el.shadowRoot.innerHTML).toContain('solfege="Re"');
    expect(el.shadowRoot.innerHTML).toContain('diacritic="w_tri"');
  });
});

describe('SolfegeTextInputComponent', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should emit tokens via EventBus when input changes', async () => {
    const el = document.createElement('ppt-solfege-text-input') as any;
    el.setAttribute('emit-id', 'test-input');
    document.body.appendChild(el);
    
    // Bind the input by publishing an active editor
    EventBus.publish('active-phrase-editor-changed', { editor: {}, rawText: '' });
    await Promise.resolve();
    
    const input = el.shadowRoot.querySelector('input');
    
    let receivedPayload: any = null;
    EventBus.subscribe('test-input', (payload) => {
      receivedPayload = payload;
    });
    
    input.value = 'ReSub';
    input.dispatchEvent(new Event('input'));
    
    await Promise.resolve();
    
    expect(receivedPayload).not.toBeNull();
    expect(receivedPayload.type).toBe('phrase');
    expect(receivedPayload.tokens[0].solfege).toBe('Re');
    expect(receivedPayload.tokens[0].diacritic).toBe('w_tri');
  });
});
