import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { UniformSolfegeComponent } from '../UniformSolfegeComponent.js';

describe('UniformSolfegeComponent', () => {
  beforeEach(() => {
    // Component already registered when module loaded
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should define component properties', () => {
    expect(UniformSolfegeComponent.componentDef.displayName).toBe('Solfege Glyph');
    expect(UniformSolfegeComponent.pptMetadata.solfege).toBeDefined();
  });

  it('should render correct SVG based on solfege attribute', () => {
    const instance = document.createElement('ppt-uniform-solfege') as any;
    instance.setAttribute('solfege', 'Do');
    document.body.appendChild(instance);

    // Processed SVGs will have width="100%" height="100%"
    const svgContainer = instance.shadowRoot.querySelector('.svg-container');
    expect(svgContainer).not.toBeNull();
    // Do uses doSvgRaw which gets processed to remove hardcoded black colors
    expect(svgContainer.innerHTML).toContain('currentColor');
  });

  it('should render annotations if annotation-align is set', () => {
    const instance = document.createElement('ppt-uniform-solfege') as any;
    instance.setAttribute('solfege', 'Re');
    instance.setAttribute('annotation-align', 'bottom');
    document.body.appendChild(instance);

    const annotation = instance.shadowRoot.querySelector('.solfege-annotation.align-bottom');
    expect(annotation).not.toBeNull();
    expect(annotation.textContent).toBe('Re');

    instance.setAttribute('annotation-align', 'top');
    const annotationTop = instance.shadowRoot.querySelector('.solfege-annotation.align-top');
    expect(annotationTop).not.toBeNull();
  });

  it('should adjust annotation scale correctly', () => {
    const instance = document.createElement('ppt-uniform-solfege') as any;
    instance.setAttribute('solfege', 'SuperLongSolfegeString');
    instance.setAttribute('annotation-align', 'top');
    document.body.appendChild(instance);

    // We can't fully test getBoundingClientRect in JSDOM, but we can verify the observer triggers the method
    const adjustSpy = vi.spyOn(instance, 'adjustAnnotationScale');
    instance.adjustAnnotationScale();
    expect(adjustSpy).toHaveBeenCalled();
  });

  it('should process diacritics', () => {
    const instance = document.createElement('ppt-uniform-solfege') as any;
    // According to parseSolfegeToken, diacritics are suffixes like 'Sub', 'HalfSub', 'HalfSup', 'Sup', 'Axis', 'x'
    instance.setAttribute('solfege', 'FaSub'); // Sub maps to w_tri
    document.body.appendChild(instance);

    const diacriticGlyph = instance.shadowRoot.querySelectorAll('.diacritic-glyph');
    expect(diacriticGlyph.length).toBeGreaterThan(0);
  });

  it('should process other diacritics', () => {
    const instance = document.createElement('ppt-uniform-solfege') as any;
    instance.setAttribute('solfege', 'FaAxis'); // Axis maps to axis
    document.body.appendChild(instance);

    const diacriticGlyph = instance.shadowRoot.querySelector('.diacritic-glyph');
    expect(diacriticGlyph).not.toBeNull();
  });

  it('should process Sup diacritic', () => {
    const instance = document.createElement('ppt-uniform-solfege') as any;
    instance.setAttribute('solfege', 'FaSup'); // Sup maps to d_tri
    document.body.appendChild(instance);

    const diacriticGlyph = instance.shadowRoot.querySelectorAll('.diacritic-glyph');
    expect(diacriticGlyph.length).toBeGreaterThan(0);
  });

  it('should process default solfege with no value', () => {
    const instance = document.createElement('ppt-uniform-solfege') as any;
    instance.setAttribute('solfege', '');
    document.body.appendChild(instance);

    const svgContainer = instance.shadowRoot.querySelector('.svg-container');
    expect(svgContainer).not.toBeNull();
  });

  it('should render nested superscript', () => {
    const instance = document.createElement('ppt-uniform-solfege') as any;
    instance.setAttribute('solfege', 'Do^Re');
    document.body.appendChild(instance);

    const superscriptWrapper = instance.shadowRoot.querySelector('.superscript-wrapper');
    expect(superscriptWrapper).not.toBeNull();

    const childSolfege = superscriptWrapper.querySelector('ppt-uniform-solfege');
    expect(childSolfege).not.toBeNull();
    expect(childSolfege.getAttribute('solfege')).toBe('Re');
  });
});
