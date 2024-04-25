import Piano from "./js/piano";
import midiNote from "midi-note";
import MidiPlayer from "./js/MidiPlayer";
import Line from "./js/Line";
import Circle from "./js/Circle";

let translateX = 0;
let lastNote = null;
const canvas = document.getElementsByTagName("canvas")[0];
let isMouseDown = false;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");
const noteDelay = 200;
const monPiano = new Piano();
const allLines = [];

const imgInterface = new Image();
imgInterface.src = 'public/interface.jpg';

imgInterface.onload = function() {
  ctx.drawImage(imgInterface, 0, 0, canvas.width, canvas.height);
};

function randomNote() {
  const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  const octaves = ['2', '3', '4', '5', '6'];
  return notes[Math.floor(Math.random() * notes.length)] + octaves[Math.floor(Math.random() * octaves.length)];
}

let lastX = null;
let lastY = null;

canvas.addEventListener("mousedown", (event) => {
  isMouseDown = true;
  lastX = event.clientX;
  lastY = event.clientY;
  const note = randomNote();
  lastNote = note;
  monPiano.sampler.triggerAttack(note);
});

canvas.addEventListener("mouseup", () => {
  isMouseDown = false;
  if (lastNote) {
    monPiano.sampler.triggerRelease(lastNote);
  }
});

canvas.addEventListener("mousemove", (event) => {
  if (isMouseDown) {
    const note = randomNote();
    lastNote = note;
    const line = new Line(lastX - translateX, lastY, event.clientX - translateX, event.clientY, "red", ctx, note, monPiano);
  
    allLines.push(line);
    monPiano.sampler.triggerAttackRelease(note, "1n", "+0.1");
    lastX = event.clientX;
    lastY = event.clientY;
  }
});

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (imgInterface.complete) {
    ctx.drawImage(imgInterface, 0, 0, canvas.width, canvas.height);
  }

  translateX -= 2; 

  // Apply the translation to the context
  ctx.setTransform(1, 0, 0, 1, translateX, 0);

  // Draw all lines
  allLines.forEach((line) => {
    line.draw();
  });

  ctx.setTransform(1, 0, 0, 1, 0, 0);

  // Clear a 50-pixel-wide strip on the left side of the canvas
  ctx.clearRect(0, 0, 77, canvas.height);

  // Request the next animation frame
  requestAnimationFrame(draw);
}

draw();
setVolume();
function setVolume() {
  monPiano.sampler.volume.value = -30;
}