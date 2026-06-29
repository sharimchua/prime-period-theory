import { BasePPTComponent } from './BasePPTComponent.js';
import { WithInteractive } from './features/WithInteractive.js';
import { WithSound } from './features/WithSound.js';
import { WithPitch } from './features/WithPitch.js';
import { WithHighlight } from './features/WithHighlight.js';
import { WithMidi } from './features/WithMidi.js';
import * as Tone from 'tone';

export class PeriodStepCircleComponent extends WithMidi(WithHighlight(WithPitch(WithSound(WithInteractive(BasePPTComponent))))) {
  static override get componentDef() {
    return {
      displayName: 'Step Circle',
      familyColor: '#2ecc71',
      acceptsChildren: [],
      canNestIn: ['ppt-period']
    };
  }

  static override get observedAttributes() {
    return [...super.observedAttributes, 'color', 'label'];
  }

  static override get pptMetadata() {
    return {
      ...super.pptMetadata,
      color: { type: 'color', default: '#ffffff', description: 'The fill color of the step circle.' },
      label: { type: 'string', default: '', description: 'Text label displayed inside the step circle (e.g., degree or step number).' }
    };
  }

  get color() {
    return this.getAttribute('color') || 'var(--ppt-marker-bg, #fff)';
  }

  set color(value: string) {
    this.setAttribute('color', value);
  }

  get label() {
    return this.getAttribute('label') || '';
  }

  set label(value: string) {
    this.setAttribute('label', value);
  }

  override attributeChangedCallback(name: string, _oldValue: string, newValue: string) {
    super.attributeChangedCallback(name, _oldValue, newValue);
    if (name === 'color') {
      this.style.setProperty('--step-bg-color', this.color);
    } else if (name === 'label') {
      const textEl = this.shadowRoot?.querySelector('.step-marker');
      if (textEl) textEl.textContent = newValue;
    }
  }

  override connectedCallback() {
    super.connectedCallback();
    this.style.setProperty('--step-bg-color', this.color);
    this.render();

    const marker = this.shadowRoot?.querySelector('.step-marker');
    marker?.addEventListener('click', () => {
      if (this.interactive) {
        this.playSound(this.pitch);
        this.highlight();
        setTimeout(() => this.unhighlight(), 200);
      }
    });
  }

  onMidiMessage(event: any) {
    if (!this.pitch) return;
    try {
      const targetMidi = Tone.Frequency(this.pitch).toMidi();
      if (event.type === 'noteon' && event.note === targetMidi) {
        this.highlight();
      } else if (event.type === 'noteoff' && event.note === targetMidi) {
        this.unhighlight();
      }
    } catch (e) {
      // invalid pitch string
    }
  }

  private render() {
    if (!this.shadowRoot) return;

    this.shadowRoot.innerHTML = `
      <style>
        ${this.getBaseStyles()}
        
        :host {
          display: block;
          position: absolute; /* Will be managed by PeriodComponent */
          translate: -50% -50%; /* Centered on its coordinate */
          width: max(24px, 8cqmin);
          height: max(24px, 8cqmin);
          --ppt-interactive-opacity: 1 !important; /* Step circles never fade when muted */
        }

        .step-marker {
          width: 100%;
          height: 100%;
          background: var(--step-bg-color);
          border: var(--ppt-marker-border, 1px solid #999);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--ppt-font-family, system-ui, sans-serif);
          font-size: max(12px, 4cqmin);
          font-weight: 600;
          color: var(--ppt-text-color, #333);
          cursor: pointer;
          transition: transform 0.2s, background 0.2s;
        }

        .step-marker:hover {
          transform: scale(1.2);
          background: var(--ppt-marker-hover-bg, #e0e0e0);
        }
      </style>

      <div class="step-marker">
        ${this.label}
      </div>
    `;
  }
}

customElements.define('ppt-period-step-circle', PeriodStepCircleComponent);
