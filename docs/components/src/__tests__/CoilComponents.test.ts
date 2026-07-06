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

  it('should render ppt-coil-row with chrome', () => {
    const el = document.createElement('ppt-coil-row');
    el.setAttribute('label', 'Test Voice');
    document.body.appendChild(el);
    
    expect(el.shadowRoot?.innerHTML).toContain('Test Voice');
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
    expect(document.activeElement).toBe(el);
    
    // Emit token
    EventBus.publish('glyph-input', { type: 'glyph', solfege: 'Re', diacritic: 'Sub' });
    
    // Wait for microtasks
    await Promise.resolve();
    
    expect(el.shadowRoot.innerHTML).toContain('solfege="Re"');
    expect(el.shadowRoot.innerHTML).toContain('diacritic="Sub"');
  });
});

describe('SolfegeTextInputComponent', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should emit tokens via EventBus when send is clicked', async () => {
    const el = document.createElement('ppt-solfege-text-input') as any;
    el.setAttribute('emit-id', 'test-input');
    document.body.appendChild(el);
    
    const input = el.shadowRoot.querySelector('input');
    const button = el.shadowRoot.querySelector('button');
    
    let receivedPayload: any = null;
    EventBus.subscribe('test-input', (payload) => {
      receivedPayload = payload;
    });
    
    input.value = 'ReSub';
    button.click();
    
    await Promise.resolve();
    
    expect(receivedPayload).not.toBeNull();
    expect(receivedPayload.solfege).toBe('Re');
    expect(receivedPayload.diacritic).toBe('w_tri'); // 'Sub' mapped to 'w_tri'
  });
});
