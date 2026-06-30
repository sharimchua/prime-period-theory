// Uniform Solfège Text Decorator
// Recursively replaces plain-text Solfège references in standard page text
// with `<ppt-uniform-solfege>` components while maintaining copy-paste text compatibility.

// The set of PPT Solfège base syllables (capitalized only)
const BASE_SYLLABLES = 'Do|Di|Ra|Re|Ri|Me|Mi|Fa|Fi|So|Le|La|Te|Se|Ti|Si';

// Diacritic suffixes
const DIACRITICS = 'Sub|HalfSub|HalfSup|Sup|Axis';

// Strictly match capitalized syllables, optional diacritics, and optional superscripts (e.g. Do^Mi, ReSub^FaSup)
const solfegeRegex = new RegExp(
  `\\b(${BASE_SYLLABLES})(${DIACRITICS})?(?:\\^(?:${BASE_SYLLABLES})(${DIACRITICS})?)*\\b`,
  'g'
);

/**
 * Checks if a matched term is a false positive English grammatical word.
 * For example, "Do" in "Do not modify" or "So" in "So that its cycle".
 */
function isFalsePositive(matchText: string, fullText: string, matchIndex: number): boolean {
  if (matchText === 'Do' || matchText === 'So' || matchText === 'Me' || matchText === 'La') {
    const afterText = fullText.substring(matchIndex + matchText.length);
    // Find the next word by skipping punctuation and whitespace
    const nextWordMatch = afterText.match(/^[^\w]*([a-zA-Z]+)/);
    if (nextWordMatch) {
      const nextWord = nextWordMatch[1].toLowerCase();
      
      if (matchText === 'Do') {
        const doExclusions = ['not', 'you', 'we', 'they', 'i', 'it', 'the', 'a', 'an', 'any', 'all', 'each', 'every', 'some', 'this', 'that', 'these', 'those'];
        if (doExclusions.includes(nextWord)) return true;
      }
      
      if (matchText === 'So') {
        const soExclusions = ['that', 'the', 'we', 'you', 'they', 'i', 'it', 'a', 'an', 'any', 'all', 'each', 'every', 'some', 'this', 'that', 'these', 'those', 'is', 'was', 'has', 'have', 'had', 'does', 'do', 'did', 'can', 'could', 'would', 'should', 'will', 'shall', 'may', 'might', 'must', 'many', 'much', 'few', 'little', 'more', 'most', 'good', 'bad', 'well', 'long', 'short', 'far', 'near', 'high', 'low', 'big', 'small', 'great', 'large', 'new', 'old', 'young'];
        if (soExclusions.includes(nextWord)) return true;
      }
    }
  }
  return false;
}

/**
 * Traverses standard text nodes in the container and replaces matching Solfège text
 * with a screen-reader-friendly wrapper and custom element.
 */
export function decorateSolfege(container: HTMLElement) {
  const walker = document.createTreeWalker(
    container,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        
        const tagName = parent.tagName.toLowerCase();
        if (
          tagName === 'script' ||
          tagName === 'style' ||
          tagName === 'textarea' ||
          tagName === 'input' ||
          tagName === 'button' ||
          parent.closest('pre') ||
          parent.closest('code') ||
          parent.closest('.ppt-solfege-text-replaced') ||
          parent.closest('ppt-uniform-solfege') ||
          parent.closest('ppt-solfege-phrase') ||
          parent.closest('ppt-solfege-phrase-panel')
        ) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    }
  );

  const textNodes: Text[] = [];
  while (walker.nextNode()) {
    textNodes.push(walker.currentNode as Text);
  }

  // Iterate backwards to prevent index shifts when replacing DOM nodes
  for (const node of textNodes) {
    const text = node.nodeValue || '';
    solfegeRegex.lastIndex = 0;
    if (!solfegeRegex.test(text)) continue;

    solfegeRegex.lastIndex = 0;
    const fragment = document.createDocumentFragment();
    let lastIndex = 0;
    let match;
    let replacedAny = false;

    while ((match = solfegeRegex.exec(text)) !== null) {
      const matchText = match[0];
      const matchIndex = match.index;

      if (isFalsePositive(matchText, text, matchIndex)) {
        continue;
      }

      replacedAny = true;

      // Add preceding plain text
      if (matchIndex > lastIndex) {
        fragment.appendChild(document.createTextNode(text.substring(lastIndex, matchIndex)));
      }

      const isAppendMode = !!(parent.closest('.solfege-append') || parent.closest('[data-solfege-append]'));

      // Create accessible wrapper
      const wrapper = document.createElement('span');
      wrapper.className = 'ppt-solfege-text-replaced';
      wrapper.setAttribute('data-original-text', matchText);
      wrapper.setAttribute('title', matchText);
      if (isAppendMode) {
        wrapper.setAttribute('data-append-mode', 'true');
      }

      if (isAppendMode) {
        // In append mode, keep the original text visible
        const textNode = document.createTextNode(matchText);
        wrapper.appendChild(textNode);
      } else {
        // Visually hidden plain text for copy-paste and screen readers
        const srText = document.createElement('span');
        srText.className = 'sr-only';
        srText.textContent = matchText;
        wrapper.appendChild(srText);
      }

      // Web component glyph
      const glyph = document.createElement('ppt-uniform-solfege');
      glyph.setAttribute('solfege', matchText);
      glyph.setAttribute('color', 'currentColor');
      glyph.setAttribute('size', '1.15em');
      glyph.setAttribute('aria-hidden', 'true');
      wrapper.appendChild(glyph);

      fragment.appendChild(wrapper);
      lastIndex = solfegeRegex.lastIndex;
    }

    if (replacedAny) {
      // Add trailing plain text
      if (lastIndex < text.length) {
        fragment.appendChild(document.createTextNode(text.substring(lastIndex)));
      }
      node.parentNode?.replaceChild(fragment, node);
    }
  }
}

/**
 * Reverts all decorated spans back to original text nodes.
 */
export function undecorateSolfege(container: HTMLElement) {
  const replacedElements = container.querySelectorAll('.ppt-solfege-text-replaced');
  for (const el of replacedElements) {
    const originalText = el.getAttribute('data-original-text');
    if (originalText) {
      const textNode = document.createTextNode(originalText);
      el.parentNode?.replaceChild(textNode, el);
    }
  }
  // Normalise container to merge separated text nodes back together
  container.normalize();
}

/**
 * Initialises page toggle handlers and applies preference on load.
 */
function initSolfegeToggle() {
  const toggleBtn = document.getElementById('solfege-glyph-toggle');
  const mainContent = document.querySelector('main');

  if (!toggleBtn || !mainContent) {
    // Retry when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initSolfegeToggle);
    }
    return;
  }

  // Load preference from localStorage
  const showGlyphs = localStorage.getItem('ppt-show-solfege-glyphs') === 'true';

  // Apply initial state
  if (showGlyphs) {
    toggleBtn.setAttribute('aria-pressed', 'true');
    decorateSolfege(mainContent);
  } else {
    toggleBtn.setAttribute('aria-pressed', 'false');
  }

  // Bind click event listener
  toggleBtn.addEventListener('click', () => {
    const isPressed = toggleBtn.getAttribute('aria-pressed') === 'true';
    const nextState = !isPressed;
    
    toggleBtn.setAttribute('aria-pressed', nextState ? 'true' : 'false');
    localStorage.setItem('ppt-show-solfege-glyphs', nextState ? 'true' : 'false');

    if (nextState) {
      decorateSolfege(mainContent);
    } else {
      undecorateSolfege(mainContent);
    }
  });
}

// Initialise the toggle script
initSolfegeToggle();
