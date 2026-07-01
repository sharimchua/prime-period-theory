/**
 * rehype-table-enhance.js
 *
 * A rehype plugin that post-processes all <table> elements in rendered Markdown:
 *
 * 1. Wraps each table in <div class="table-wrapper table--{type}"> for clean
 *    overflow-x scrolling without breaking border-radius or box model.
 *
 * 2. Auto-classifies tables into one of three CSS modifier classes:
 *    - table--compact   : 2-column tables (lookup pairs, Q&A summaries)
 *    - table--data      : 3–5 column tables with short cell content (default)
 *    - table--narrative : Tables where cells contain long prose (> 60 chars avg)
 *    - table--wide      : 5+ column tables (sticky first-col activated in CSS)
 *
 * 3. Adds data-label="[header text]" attributes to every <td> so the CSS
 *    card-stack mobile transform can render each cell with its column heading.
 *
 * 4. Reads an optional <!-- table:compact --> HTML comment immediately before
 *    a table to force the compact class (e.g. for manually overriding a 3-col
 *    table that has short enough content).
 *
 * Usage: add as a rehypePlugin in astro.config.mjs.
 */

import { visit } from 'unist-util-visit';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Extract all plain text from a hast node tree. */
function textContent(node) {
  if (!node) return '';
  if (node.type === 'text') return node.value || '';
  if (!node.children) return '';
  return node.children.map(textContent).join('');
}

/** Check whether a hast node is an element with the given tag name. */
function isElement(node, tagName) {
  return node && node.type === 'element' && node.tagName === tagName;
}

/**
 * Determine the CSS modifier classes for a table.
 *
 * Returns an array of class strings. Wide tables with long prose content
 * receive both 'table--wide' and 'table--narrative' so the CSS can apply
 * card-stack layout at tablet/mobile widths while retaining the wide-table
 * designation for any desktop-specific overrides.
 *
 * @param {object} tableNode  - hast element node for <table>
 * @param {boolean} forceCompact - true when a preceding <!-- table:compact --> comment was found
 * @returns {string[]} array of CSS class names
 */
function classifyTable(tableNode, forceCompact) {
  if (forceCompact) return ['table--compact'];

  // Collect header cells to determine column count
  const headers = [];
  visit(tableNode, (node) => {
    if (isElement(node, 'th')) {
      headers.push(textContent(node).trim());
    }
  });
  const colCount = headers.length;

  // Sniff average cell content length — used for both narrow and wide tables
  const cellTexts = [];
  visit(tableNode, (node) => {
    if (isElement(node, 'td')) {
      cellTexts.push(textContent(node).trim());
    }
  });
  const avgCellLen = cellTexts.length > 0
    ? cellTexts.reduce((sum, t) => sum + t.length, 0) / cellTexts.length
    : 0;
  const maxCellLen = cellTexts.length > 0
    ? Math.max(...cellTexts.map(t => t.length))
    : 0;

  if (colCount <= 2) return ['table--compact'];

  if (colCount >= 5) {
    // Wide tables: use MAX cell length, not average. One long column is
    // enough to make the table unusable as a horizontal-scroll layout.
    // Threshold: any single cell over 80 chars → wide+narrative (card-stack).
    const hasLongProse = maxCellLen > 80;
    return hasLongProse ? ['table--wide', 'table--narrative'] : ['table--wide'];
  }

  // 3–4 column tables: use average OR max as a belt-and-suspenders check.
  // Lower average threshold (50) catches tables where most cells are medium-length.
  // Max threshold (120) catches tables with one very long outlier column.
  if (avgCellLen > 50 || maxCellLen > 120) return ['table--narrative'];
  return ['table--data'];
}

/**
 * Build the wrapper <div> hast node.
 *
 * @param {object} tableNode  - the original <table> hast node
 * @param {string[]} modifierClasses - e.g. ['table--compact'] or ['table--wide', 'table--narrative']
 * @returns {object} hast div node
 */
function buildWrapper(tableNode, modifierClasses) {
  return {
    type: 'element',
    tagName: 'div',
    properties: {
      className: ['table-wrapper', ...modifierClasses],
    },
    children: [tableNode],
  };
}

/**
 * Inject data-label attributes onto every <td> in the table, using the
 * corresponding <th> header text for that column index.
 *
 * @param {object} tableNode  - hast element node for <table>
 * @param {string[]} headers  - array of header label strings, one per column
 */
function injectDataLabels(tableNode, headers) {
  // Walk each <tr> in <tbody>
  visit(tableNode, (node) => {
    if (!isElement(node, 'tbody')) return;
    visit(node, (trNode) => {
      if (!isElement(trNode, 'tr')) return;
      let colIndex = 0;
      (trNode.children || []).forEach((child) => {
        if (isElement(child, 'td')) {
          const label = headers[colIndex] || '';
          if (label) {
            child.properties = child.properties || {};
            child.properties['dataLabel'] = label;
          }
          colIndex++;
        }
      });
    });
  });
}

// ---------------------------------------------------------------------------
// Plugin
// ---------------------------------------------------------------------------

export function rehypeTableEnhance() {
  return function (tree) {
    // We need to find <table> nodes and their parent+index so we can replace
    // them with a wrapper div. We collect replacements first, then apply them
    // to avoid mutating the tree during traversal.
    const replacements = [];

    visit(tree, 'element', (node, index, parent) => {
      if (!isElement(node, 'table') || !parent || index == null) return;

      // Check for an immediately preceding HTML comment <!-- table:compact -->
      let forceCompact = false;
      const prevSibling = parent.children[index - 1];
      if (prevSibling && prevSibling.type === 'raw' && prevSibling.value) {
        forceCompact = /<!--\s*table:compact\s*-->/.test(prevSibling.value);
      }
      // Also check hast comment nodes (rehype may parse them as type:'comment')
      if (prevSibling && prevSibling.type === 'comment') {
        forceCompact = /table:compact/.test(prevSibling.value || '');
      }

      // Extract header labels
      const headers = [];
      visit(node, (thNode) => {
        if (isElement(thNode, 'th')) {
          headers.push(textContent(thNode).trim());
        }
      });

      // Inject data-label on all <td> cells
      injectDataLabels(node, headers);

      // Classify and build wrapper
      const modifierClasses = classifyTable(node, forceCompact);
      const wrapper = buildWrapper(node, modifierClasses);

      replacements.push({ parent, index, wrapper });
    });

    // Apply replacements in reverse order (to preserve indices)
    for (let i = replacements.length - 1; i >= 0; i--) {
      const { parent, index, wrapper } = replacements[i];
      parent.children.splice(index, 1, wrapper);
    }
  };
}
