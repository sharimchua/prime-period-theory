import { describe, it, expect, beforeEach } from 'vitest';
import { decorateSolfege, undecorateSolfege } from '../solfegeDecorator.js';

describe('solfegeDecorator', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    return () => {
      container.remove();
    };
  });

  it('should decorate basic solfege words', () => {
    container.innerHTML = '<p>This is Do and ReSub on the grid.</p>';
    decorateSolfege(container);

    const replaced = container.querySelectorAll('.ppt-solfege-text-replaced');
    expect(replaced).toHaveLength(2);

    expect(replaced[0].getAttribute('data-original-text')).toBe('Do');
    expect(replaced[0].getAttribute('title')).toBe('Do');
    expect(replaced[0].querySelector('.sr-only')?.textContent).toBe('Do');
    expect(replaced[0].querySelector('ppt-uniform-solfege')?.getAttribute('solfege')).toBe('Do');

    expect(replaced[1].getAttribute('data-original-text')).toBe('ReSub');
    expect(replaced[1].getAttribute('title')).toBe('ReSub');
    expect(replaced[1].querySelector('.sr-only')?.textContent).toBe('ReSub');
    expect(replaced[1].querySelector('ppt-uniform-solfege')?.getAttribute('solfege')).toBe('ReSub');
  });

  it('should decorate compound superscript solfege', () => {
    container.innerHTML = '<p>We have Do^Mi and ReSub^FaSup here.</p>';
    decorateSolfege(container);

    const replaced = container.querySelectorAll('.ppt-solfege-text-replaced');
    expect(replaced).toHaveLength(2);
    expect(replaced[0].getAttribute('data-original-text')).toBe('Do^Mi');
    expect(replaced[1].getAttribute('data-original-text')).toBe('ReSub^FaSup');
  });

  it('should NOT decorate text inside code or pre elements', () => {
    container.innerHTML = '<p>This is Do, but <code>code Do</code> and <pre>pre Re</pre> should not change.</p>';
    decorateSolfege(container);

    const replaced = container.querySelectorAll('.ppt-solfege-text-replaced');
    expect(replaced).toHaveLength(1);
    expect(replaced[0].getAttribute('data-original-text')).toBe('Do');
  });

  it('should avoid false positive English words like "Do not" and "So that"', () => {
    container.innerHTML = '<p>Do not modify the file. So that its cycle is complete. Re is correct.</p>';
    decorateSolfege(container);

    const replaced = container.querySelectorAll('.ppt-solfege-text-replaced');
    // Only "Re" should be decorated
    expect(replaced).toHaveLength(1);
    expect(replaced[0].getAttribute('data-original-text')).toBe('Re');
  });

  it('should undecorate back to the exact original text', () => {
    const originalHTML = '<p>This is Do and ReSub on the grid.</p>';
    container.innerHTML = originalHTML;

    decorateSolfege(container);
    expect(container.querySelectorAll('.ppt-solfege-text-replaced')).toHaveLength(2);

    undecorateSolfege(container);
    expect(container.querySelectorAll('.ppt-solfege-text-replaced')).toHaveLength(0);
    expect(container.innerHTML).toBe(originalHTML);
  });
});
