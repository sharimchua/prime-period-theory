import { serializePayload, deserializePayload, compressPayload, decompressPayload } from './payloadCodec';

export function getSerializeTarget(targetElement: HTMLElement, targetId: string): HTMLElement {
  let serializeTarget = targetElement;
  // Specific showcase logic to determine what is serialized
  if (targetId === 'demo-step-circle' && targetElement.parentElement) {
    serializeTarget = targetElement.parentElement;
  } else if (targetId === 'demo-clock' && targetElement.parentElement) {
    serializeTarget = targetElement;
  }
  return serializeTarget;
}

export function wrapInContainerIfNeeded(element: HTMLElement): HTMLElement {
  if (element.tagName.toLowerCase() === 'ppt-container') {
    return element;
  }
  const wrapper = document.createElement('div');
  const container = document.createElement('ppt-container');
  container.setAttribute('resizable', 'true');
  container.style.width = '400px';
  container.style.height = '400px';
  
  container.appendChild(element.cloneNode(true));
  wrapper.appendChild(container);
  return wrapper;
}

export async function generateComposerUrl(
  targetElement: HTMLElement,
  targetId: string,
  origin: string,
  pathname: string
): Promise<string> {
  const serializeTarget = getSerializeTarget(targetElement, targetId);
  const rootToSerialize = wrapInContainerIfNeeded(serializeTarget);
  
  const rawPayload = serializePayload(rootToSerialize);
  const compressedPayload = await compressPayload(rawPayload);
  
  const baseUrl = origin + pathname.replace(/\/components.*$/, '/components');
  return `${baseUrl}/designer?payload=${encodeURIComponent(compressedPayload)}`;
}

export async function loadPayloadIntoCanvas(payload: string, canvas: HTMLElement): Promise<void> {
  const rawPayload = await decompressPayload(payload);
  deserializePayload(rawPayload, canvas);
}
