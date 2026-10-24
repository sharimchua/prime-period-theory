const originalWarn = console.warn;
console.warn = (...args) => {
  if (typeof args[0] === 'string' && args[0].includes('WebMidi API not supported')) return;
  if (typeof args[0] === 'string' && args[0].includes('MIDI access denied or failed')) return;
  originalWarn(...args);
};
const originalError = console.error;
console.error = (...args) => {
  if (typeof args[0] === 'string' && args[0].includes('MIDI connection failed:')) return;
  originalError(...args);
};
