import { describe, it, expect, beforeEach, afterEach } from 'vitest';
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
