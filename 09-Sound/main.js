import Piano from "./js/piano";
import midiNote from "midi-note";
import MidiPlayer from "./js/MidiPlayer";
import Circle from "./js/Circle";

let lastNote = null;
const canvas = document.getElementsByTagName("canvas")[0];
let isMouseDown = false;
//fullscreen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");
const noteDelay = 200;
const monPiano = new Piano();
const allCircles = [];

function randomNote() {
  const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  const octaves = ['2', '3', '4', '5', '6'];
  return notes[Math.floor(Math.random() * notes.length)] + octaves[Math.floor(Math.random() * octaves.length)];
}

canvas.addEventListener("mousedown", (event) => {
  isMouseDown = true;
  const note = randomNote();
  lastNote = note;
  const circle = new Circle(event.clientX, event.clientY, 10, "red", ctx, note, monPiano);
  allCircles.push(circle);
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
    const circle = new Circle(event.clientX, event.clientY, 10, "red", ctx, note, monPiano);
    allCircles.push(circle);
    monPiano.sampler.triggerAttackRelease(note, "1n", "+0.5");
  }
});





/* canvas.addEventListener("click", (event) => {
  const note = midiNote(Math.floor(Math.random() * 126) + 1);
  const cercle = new Circle(
    event.clientX,
    event.clientY,
    10,
    "red",
    ctx,
    note,
    monPiano
  );
  allCircles.push(cercle);
  monPiano.sampler.triggerAttack(note);
}); */
 
  

  // console.log("key", event.key);
  // const note = midiNote(Math.floor(Math.random() * 126) + 1);
  // monPiano.sampler.triggerAttack(note);


// const cercle = new Circle(100, 100, 50, "red", ctx);
// allCircles.push(cercle);

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // console.log("draw");

  allCircles.forEach((cercle) => {
    // cercle.move();
    cercle.draw();
  });

  // cercle.move();
  // cercle.draw();

  requestAnimationFrame(draw);
}

draw();
setVolume();
function setVolume() {
  monPiano.sampler.volume.value = -30;
}