export function getTargetEntries(metadata, tagName) {
  const meta = { ...metadata };
  return Object.entries(meta).sort((a, b) => {
    if (a[1]?.isContent) return 1;
    if (b[1]?.isContent) return -1;
    return 0;
  });
}

export function getParentEntries(parentMetadata, allowedParentList) {
  const parentEntriesRaw = Object.entries(parentMetadata || {}).filter((entry) => allowedParentList.length === 0 || allowedParentList.includes(entry[0]));
  return parentEntriesRaw.sort((a, b) => {
    if (a[1]?.isContent) return 1;
    if (b[1]?.isContent) return -1;
    return 0;
  });
}

export function renderControl(targetId, key, meta, prefix) {
  let controlHtml = '';
  const isContentAttr = meta.isContent ? 'data-is-content="true"' : '';

  if (meta.type === 'boolean') {
    const isChecked = meta.default === true || meta.default === 'true';
    controlHtml = `<input type="checkbox" id="${targetId}-${prefix}-${key}" class="auto-prop-input" data-target-type="${prefix}" data-attr="${key}" ${isContentAttr} ${isChecked ? 'checked' : ''} />`;
  } else if (meta.type === 'enum' && meta.options) {
    const options = meta.options.map((opt) => `<option value="${opt}" ${meta.default === opt ? 'selected' : ''}>${opt}</option>`).join('');
    controlHtml = `<select id="${targetId}-${prefix}-${key}" class="auto-prop-input" data-target-type="${prefix}" data-attr="${key}" ${isContentAttr}>${options}</select>`;
  } else if (meta.type === 'color') {
    controlHtml = `<input type="color" id="${targetId}-${prefix}-${key}" class="auto-prop-input" data-target-type="${prefix}" data-attr="${key}" ${isContentAttr} value="${meta.default || '#ffffff'}" />`;
  } else if (meta.isContent) {
    controlHtml = `<textarea id="${targetId}-${prefix}-${key}" class="auto-prop-input" data-target-type="${prefix}" data-attr="${key}" ${isContentAttr} rows="3" style="resize: vertical; width: 100%;">${meta.default || ''}</textarea>`;
  } else {
    const inputType = meta.type === 'number' ? 'number' : 'text';
    controlHtml = `<input type="${inputType}" id="${targetId}-${prefix}-${key}" class="auto-prop-input" data-target-type="${prefix}" data-attr="${key}" ${isContentAttr} value="${meta.default || ''}" />`;
  }

  // Adding the override checkbox
  const overrideCheckbox = `<input type="checkbox" class="auto-prop-override" data-target-input="${targetId}-${prefix}-${key}" data-attr="${key}" data-target-type="${prefix}" ${isContentAttr} title="Toggle to define/override this property" checked />`;

  return `
    <div class="prop-group">
      <div class="prop-info-col">
        <label for="${targetId}-${prefix}-${key}">${key}</label>
        ${meta.description ? `<div class="prop-desc">${meta.description}</div>` : ''}
      </div>
      <div class="prop-control-col ${meta.type === 'boolean' ? 'is-checkbox' : ''}">
        ${overrideCheckbox}
        ${controlHtml}
      </div>
    </div>
  `;
}
