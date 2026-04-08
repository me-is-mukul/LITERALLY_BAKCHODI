// Sound effects utility
const soundCache = {};

// Create audio context and buffers
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// Simple beep generator
function generateTone(frequency, duration, type = 'sine') {
  const now = audioContext.currentTime;
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();

  osc.connect(gain);
  gain.connect(audioContext.destination);

  osc.type = type;
  osc.frequency.value = frequency;

  gain.gain.setValueAtTime(0.3, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

  osc.start(now);
  osc.stop(now + duration);
}

export const soundEffects = {
  click: () => {
    // Soft click - low beep
    generateTone(200, 0.1);
  },

  select: () => {
    // Selection sound - higher pitch
    generateTone(400, 0.15);
  },

  success: () => {
    // Win sound - ascending tones
    generateTone(523, 0.1); // C
    setTimeout(() => generateTone(659, 0.15), 100); // E
    setTimeout(() => generateTone(784, 0.2), 200); // G
  },

  failure: () => {
    // Loss sound - descending tones
    generateTone(400, 0.1);
    setTimeout(() => generateTone(300, 0.15), 100);
    setTimeout(() => generateTone(200, 0.2), 200);
  },

  guess: () => {
    // Guess submission - double beep
    generateTone(600, 0.1);
    setTimeout(() => generateTone(600, 0.1), 150);
  },

  wrong: () => {
    // Wrong guess - buzzer sound
    generateTone(100, 0.3, 'sawtooth');
  },

  ambient: () => {
    // Ambient whoosh
    const now = audioContext.currentTime;
    const noise = audioContext.createBufferSource();
    const buffer = audioContext.createBuffer(1, audioContext.sampleRate * 0.3, audioContext.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < buffer.length; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const gain = audioContext.createGain();
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

    noise.buffer = buffer;
    noise.connect(gain);
    gain.connect(audioContext.destination);
    noise.start(now);
  }
};

// Play sound with error handling
export function playSound(soundName) {
  try {
    if (soundEffects[soundName]) {
      soundEffects[soundName]();
    }
  } catch (e) {
    console.log('Sound playback not available');
  }
}
