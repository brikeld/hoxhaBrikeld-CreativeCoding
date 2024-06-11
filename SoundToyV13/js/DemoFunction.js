import { compositions } from "./compositions";
import * as Tone from "tone";

let index = 0;
let playedSounds = [];

let currentLineButtonIndex = 0;
const lineButtonImages = [];
const totalLineButtons = 2;
for (let i = 1; i <= totalLineButtons; i++) {
  let img = new Image();
  img.src = `lineaPNG/line (${i}).png`;
  lineButtonImages.push(img);
}

export function setPlayedSoundsArray(externalPlayedSounds) {
  playedSounds = externalPlayedSounds;
}

export default function DemoFunction(
  monPiano,
  canvas,
  ctx,
  placedIcons,
  iconImages,
  textButtonImages,
  translateX
) {
  let backgroundAudio;

  function initializeBackgroundAudio(url) {
    backgroundAudio = new Tone.Player({
      url: url,
      loop: true,
      autostart: true,
    }).toDestination();
  }

  function setBackgroundAudioVolume(volume) {
    if (backgroundAudio) {
      backgroundAudio.volume.value = volume;
    }
  }

  const drawingArea = {
    x: canvas.width / 30,
    y: canvas.height / 20,
    width: canvas.width / 1.325,
    height: canvas.height / 1.259,
  };

  function placeRandomImage(note, type) {
    let img;
    let imageIndex = parseInt(note.substring(1)) - 1;
  
    if (type === "icon") {
      if (imageIndex < 0 || imageIndex >= iconImages.length) {
        console.error(`Invalid image index for icon: ${imageIndex}`);
        return;
      }
      img = iconImages[imageIndex];
    } else if (type === "text") {
      if (imageIndex < 0 || imageIndex >= textButtonImages.length) {
        console.error(`Invalid image index for text: ${imageIndex}`);
        return;
      }
      img = textButtonImages[imageIndex];
    } else if (type === "line") {
      if (imageIndex < 0 || imageIndex >= lineButtonImages.length) {
        console.error(`Invalid image index for line: ${imageIndex}`);
        return;
      }
      img = lineButtonImages[imageIndex];
    } else {
      console.error(`Unknown type: ${type}`);
      return;
    }
  
    const maxWidth = drawingArea.width - img.width;
    const maxHeight = drawingArea.height - img.height;
  
    const x = drawingArea.x + Math.random() * maxWidth - translateX;
    const y = drawingArea.y + Math.random() * maxHeight;
  
    placedIcons.push({
      img: img,
      x: x,
      y: y,
    });
  
    ctx.drawImage(img, x, y, img.width, img.height);
    console.log(`Image placed: ${img.src} at (${x}, ${y})`);
  }

  const Composition1 = compositions[index];
  index = (index + 1) % compositions.length;

  Composition1.forEach((sound) => {
    setTimeout(() => {
      if (sound.type === "icon") {
        monPiano.iconSampler.triggerAttackRelease(sound.note, "1n");
      } else if (sound.type === "text") {
        monPiano.textSampler.triggerAttackRelease(sound.note, "1n");
      } else if (sound.type === "line") {
        monPiano.lineSampler.triggerAttackRelease(sound.note, "1n");
      }
      placeRandomImage(sound.note, sound.type);
      playedSounds.push(sound); // Add the sound to the playedSounds array
    }, sound.delay * 1000);
  });
}
