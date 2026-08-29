import { describe, it, expect } from 'vitest';
import '../PitchClockComponent.js';
import { parseTonic } from '../PitchClockComponent.js';

describe('PitchClockComponent & parseTonic', () => {
  it('should parse various tonic representations accurately', () => {
    expect(parseTonic(0)).toBe(0);
    expect(parseTonic('0')).toBe(0);
    expect(parseTonic('2')).toBe(2);
    expect(parseTonic('11')).toBe(11);
    expect(parseTonic('C')).toBe(0);
    expect(parseTonic('C4')).toBe(0);
    expect(parseTonic('D')).toBe(2);
    expect(parseTonic('D4')).toBe(2);
    expect(parseTonic('Eb4')).toBe(3);
    expect(parseTonic('E')).toBe(4);
    expect(parseTonic('F#3')).toBe(6);
    expect(parseTonic('G')).toBe(7);
    expect(parseTonic('A')).toBe(9);
    expect(parseTonic('Bb4')).toBe(10);
  });

  it('should register <ppt-pitch-clock> custom element and render shadow root', () => {
    const el = document.createElement('ppt-pitch-clock');
    document.body.appendChild(el);

    expect(el.shadowRoot).not.toBeNull();
    const nodes = el.shadowRoot?.querySelectorAll('.pitch-node');
    expect(nodes?.length).toBe(12);

    const hubValue = el.shadowRoot?.querySelector('.hub-value');
    expect(hubValue?.textContent).toBe('C');
  });

  it('should update tonic and rotate active node when tonic attribute changes', () => {
    const el = document.createElement('ppt-pitch-clock');
    el.setAttribute('tonic', '2'); // D
    document.body.appendChild(el);

    const hubValue = el.shadowRoot?.querySelector('.hub-value');
    expect(hubValue?.textContent).toBe('D');

    const tonicNode = el.shadowRoot?.querySelector('.pitch-node.is-tonic');
    expect(tonicNode?.getAttribute('data-pitch-class')).toBe('2');
    expect(tonicNode?.getAttribute('data-semitone')).toBe('0');
  });
});
