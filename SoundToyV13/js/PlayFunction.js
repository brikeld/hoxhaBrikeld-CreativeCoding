let timers = [];

import * as Tone from "tone";

// 
let drumsPlayer = new Tone.Player("/drums2.mp3").toDestination();
drumsPlayer.volume.value = -4; 

export default function PlayFunction(playedSounds, monPiano, allLines, placedIcons, placedTexts, ctx, canvasWidth, translateX, DemoFunction) {
  console.log('All played sounds:', playedSounds);

  timers.forEach(timer => clearTimeout(timer));
  timers = [];

  let delay = 0;
  const noteDuration = 800;

  function highlightElement(element) {
    ctx.save();
    ctx.lineWidth = 4;
    ctx.beginPath();
    if (element.x !== undefined && element.y !== undefined) {
      ctx.arc(element.x + (canvasWidth / 2), element.y, 30, 0, Math.PI * 2);
    } else {
      ctx.arc(canvasWidth / 2, canvasWidth / 2, 30, 0, Math.PI * 2);
    }
    ctx.stroke();
    ctx.restore();
  }

  let lastPlayedLineId = null;
  let drumsPlayedCount = 0;

  drumsPlayer.start();
  console.log(`Drums played count: ${drumsPlayedCount}`);

  playedSounds.forEach((sound, index) => {
    if (sound.type === 'line' && sound.element && sound.element.id === lastPlayedLineId) {
      return; // Skip this sound if it belongs to the same line as the previous one
    }

    const timer = setTimeout(() => {
      console.log(`Playing sound ${index + 1} at delay ${delay}: ${sound.note}`);

      if (sound.type === 'line') {
        if (monPiano.lineSamplerLoaded) {
          sound.element.soundPlayed = false; // Reset soundPlayed flag
          monPiano.lineSampler.triggerAttackRelease(sound.note, "1n", "+0.1");
          lastPlayedLineId = sound.element.id; // Update last played line ID
        } else {
          console.error("LineSampler not loaded");
        }
      } else if (sound.type === 'icon') {
        if (monPiano.iconSamplerLoaded) {
          monPiano.iconSampler.triggerAttackRelease(sound.note, "1n", "+0.1");
        } else {
          console.error("IconSampler not loaded");
        }
      } else if (sound.type === 'text') {
        if (monPiano.textSamplerLoaded) {
          monPiano.textSampler.triggerAttackRelease(sound.note, "1n", "+0.1");
        } else {
          console.error("TextSampler not loaded");
        }
      }

      let element = sound.element;
      if (element) {
        highlightElement(element);
        translateX = -(element.x - (canvasWidth / 2));
      }
    }, delay);
    timers.push(timer);
    delay += noteDuration;
  });
}
