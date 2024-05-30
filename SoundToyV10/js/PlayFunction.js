let timers = [];

export default function PlayFunction(playedSounds, monPiano, allLines, placedIcons, placedTexts, ctx, canvasWidth) {
  // Clear any previously set timers
  timers.forEach(timer => clearTimeout(timer));
  timers = [];

  let delay = 0;
  const noteDuration = 1000; // Duration of each note in milliseconds

  // Function to highlight the current element
  function highlightElement(element) {
    ctx.save();
    ctx.strokeStyle = 'yellow';
    ctx.lineWidth = 4;
    ctx.beginPath();
    if (element.x !== undefined && element.y !== undefined) {
      ctx.arc(element.x + (canvasWidth / 2), element.y, 30, 0, Math.PI * 2);
    } else {
      ctx.arc(canvasWidth / 2, canvasWidth / 2, 30, 0, Math.PI * 2); // Default circle in the center
    }
    ctx.stroke();
    ctx.restore();
  }

  playedSounds.forEach((note, index) => {
    const timer = setTimeout(() => {
      console.log(`Playing note ${index + 1} at delay ${delay}: ${note}`);
      monPiano.sampler.triggerAttackRelease(note, "1n", "+0.1");

      // Find the corresponding element and highlight it
      let element = allLines[index] || placedIcons[index] || placedTexts[index];
      if (element) {
        highlightElement(element);
        translateX = -(element.x - (canvasWidth / 2)); // Move to center the element
      }
    }, delay);
    timers.push(timer);
    delay += noteDuration; 
  });
}
