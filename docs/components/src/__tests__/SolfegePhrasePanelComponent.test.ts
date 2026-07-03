import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { SolfegePhrasePanelComponent } from '../SolfegePhrasePanelComponent.js';

describe('SolfegePhrasePanelComponent', () => {
  beforeEach(() => {
    // Component already registered when module loaded
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should define component properties', () => {
    expect(SolfegePhrasePanelComponent.componentDef.displayName).toBe('Solfege Phrase Panel');
    expect(SolfegePhrasePanelComponent.pptMetadata.phrase).toBeDefined();
  });

  it('should render and update ppt-solfege-phrase child', () => {
    const instance = document.createElement('ppt-solfege-phrase-panel') as any;
    document.body.appendChild(instance);

    const phraseEl = instance.shadowRoot.querySelector('ppt-solfege-phrase');
    expect(phraseEl).not.toBeNull();

    // Test attribute syncing
    instance.setAttribute('phrase', 'Do Re Mi');
    expect(phraseEl.getAttribute('phrase')).toBe('Do Re Mi');

    instance.setAttribute('size', '3rem');
    expect(phraseEl.getAttribute('size')).toBe('3rem');

    instance.removeAttribute('phrase');
    expect(phraseEl.hasAttribute('phrase')).toBe(false);
  });
});
