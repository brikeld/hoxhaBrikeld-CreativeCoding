export default function DemoFunction(monPiano, canvas, ctx, placedIcons, iconImages, textButtonImages, translateX) {
  const sounds = [
    { note: 'C1', delay: 0, type: 'icon' },
    { note: 'C5', delay: 2.482, type: 'icon' },
    { note: 'C4', delay: 0, type: 'text' },
    { note: 'C8', delay: 3.102, type: 'icon' },
  ];

  function placeRandomImage(note, type) {
    let img;
    let imageIndex = parseInt(note.substring(1)) - 1; // Determine image index from note

    if (type === 'icon') {
      if (imageIndex < 0 || imageIndex >= iconImages.length) {
        console.error(`Invalid image index for icon: ${imageIndex}`);
        return;
      }
      img = iconImages[imageIndex];
    } else if (type === 'text') {
      if (imageIndex < 0 || imageIndex >= textButtonImages.length) {
        console.error(`Invalid image index for text: ${imageIndex}`);
        return;
      }
      img = textButtonImages[imageIndex];
    } else {
      console.error(`Unknown type: ${type}`);
      return;
    }

    if (!img) {
      console.error(`Image not found for note ${note} and type ${type}`);
      return;
    }

    const visibleWidth = canvas.width - Math.abs(translateX); // Adjust for translation
    const x = (Math.random() * visibleWidth) + translateX; // Ensure x is within the visible area
    const y = Math.random() * (canvas.height - img.height);

    placedIcons.push({
      img: img,
      x: x,
      y: y,
    });

    ctx.drawImage(img, x, y, img.width, img.height);
    console.log(`Image placed: ${img.src} at (${x}, ${y})`);
  }

  sounds.forEach((sound) => {
    setTimeout(() => {
      if (sound.type === 'icon') {
        monPiano.iconSampler.triggerAttackRelease(sound.note, '1n');
      } else if (sound.type === 'text') {
        monPiano.textSampler.triggerAttackRelease(sound.note, '1n');
      }
      placeRandomImage(sound.note, sound.type); // Place the image on the canvas
    }, sound.delay * 1000);
  });
}
