export * from './BasePPTComponent.js';
export * from './features/WithPanel.js';
export * from './TextPanelComponent.js';
export * from './PeriodComponent.js';
export * from './TitleComponent.js';
export * from './ContainerComponent.js';
export * from './PeriodStepCircleComponent.js';
export * from './BoxComponent.js';
export * from './FlexComponent.js';
export * from './TextComponent.js';
export * from './PeriodSequencerComponent.js';
export * from './features/WithSound.js';
export * from './features/WithPitch.js';
export * from './features/WithHighlight.js';
export * from './features/WithHidden.js';
export * from './features/WithMidi.js';
export * from './features/MidiOrchestrator.js';
export * from './features/WithEmit.js';
export * from './features/WithListen.js';
export * from './features/EventBus.js';
export * from './ControlPanelComponent.js';
export * from './ControlBooleanComponent.js';
export * from './ControlIntegerComponent.js';
export * from './ControlTextComponent.js';
export * from './EventBindingComponent.js';
export * from './UniformSolfegeComponent.js';
export * from './PitchClockComponent.js';
export * from './playback/ToneVoiceComponent.js';
export * from './playback/CoilTransportComponent.js';
export * from './playback/PlaybackSchedulerComponent.js';
export * from './playback/CoilMixerComponent.js';
export * from './playback/PlayalongPresetsComponent.js';
export * from './SolfegePhraseComponent.js';
export * from './SolfegePhrasePanelComponent.js';
export * from './CoilComponent.js';
export * from './CoilLayerComponent.js';
export * from './CoilRowComponent.js';
export * from './PhraseEditorComponent.js';
export * from './CoilCursorComponent.js';
export * from './SolfegeTextInputComponent.js';
export * from './GridCoordinatorComponent.js';

// Feature Registration for components that need external libraries
import { MidiOrchestrator } from './features/MidiOrchestrator.js';
MidiOrchestrator.init();

export * from './MidiInputBridgeComponent.js';
export * from './HarmonicProfilerApp.js';
export * from './ApplicationLayoutComponent.js';

// ── Tapestry Composer ─────────────────────────────────────────────────────────
export * from './tapestry/TapestryModel.js';
export * from './tapestry/TapestrySerializer.js';
export * from './tapestry/TapestryResolver.js';
export * from './TapestryComposerApp.js';