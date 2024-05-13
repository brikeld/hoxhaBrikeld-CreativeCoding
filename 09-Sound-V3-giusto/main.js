import Piano from "./js/piano";
import midiNote from "midi-note";
import MidiPlayer from "./js/MidiPlayer";
import Line from "./js/Line";
import Circle from "./js/Circle";

let icons = [];

for (let i = 1; i <= 13; i++) {
  let icon = new Image();
  icon.src = `public/icons/icon (${i}).png`; 
  icon.onload = function() {
    icons.push(icon);
  }
}

let buttonClicked = false;
let canvasMoving = true;
let buttonClickedLeft = false;
let translateX = 0;
let lastNote = null;
let isMouseDown = false;


const canvas = document.getElementsByTagName("canvas")[0];
canvas.width = document.body.clientWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");
const noteDelay = 200;
const monPiano = new Piano();
const allLines = [];
const imgInterface = new Image();
imgInterface.src = '/testInterfaceQuality.png';
ctx.imageSmoothingQuality = 'best' 


canvas.addEventListener("click", (event) => { //right
  if (event.clientX >= 1400 && event.clientX <= 1500 && event.clientY >= canvas.height - 130 && event.clientY <= canvas.height - 90) {
    buttonClicked = true;
    console.log("button clicked");
  }
});

canvas.addEventListener("click", (event) => { //stop button
  if (event.clientX >= 800 && event.clientX <= 900 && event.clientY >= canvas.height - 130 && event.clientY <= canvas.height - 90) {
    canvasMoving = !canvasMoving;
    console.log("stop button clicked");
  }
});

canvas.addEventListener("click", (event) => { //left button

  if (event.clientX >= 75 && event.clientX <= 175 && event.clientY >= canvas.height - 130 && event.clientY <= canvas.height - 90) {
    buttonClickedLeft = true;
    console.log("left button clicked");
  }
});


canvas.addEventListener("click", (event) => { //white button
  const x = event.clientX;
  const y = event.clientY;

  if (x >= 2040 && x <= 2040 + 215 && y >= canvas.height - 215 && y <= canvas.height) {
    const randomIndex = Math.floor(Math.random() * icons.length);
    const selectedIcon = icons[randomIndex];

    ctx.drawImage(selectedIcon, 2040, canvas.height - 215, 215, 215);
    console.log("whiteClicked");
  }
});

imgInterface.onload = function() {
  const aspectRatio = imgInterface.width / imgInterface.height;
  let newWidth = canvas.width;
  let newHeight = newWidth / aspectRatio;
  
  if (newHeight > canvas.height) {
    newHeight = canvas.height;
    newWidth = newHeight * aspectRatio;
  }
  
  const x = (canvas.width - newWidth) / 2;
  const y = (canvas.height - newHeight) / 2;
  
  ctx.drawImage(imgInterface, x, y, newWidth, newHeight);
};

function randomNote() {
  const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  const octaves = ['2', '3', '4', '5', '6'];
  return notes[Math.floor(Math.random() * notes.length)] + octaves[Math.floor(Math.random() * octaves.length)];
}

let lastX = null;
let lastY = null;
let playedNote = false;
canvas.addEventListener("mousedown", (event) => {
  isMouseDown = true;
  lastX = event.clientX;
  lastY = event.clientY;
  const note = randomNote();
  lastNote = note;
  // monPiano.sampler.triggerAttack(note);
});

canvas.addEventListener("mouseup", () => {
  isMouseDown = false;
  if (lastNote) {
  }
  playedNote = false;
});

canvas.addEventListener("mousemove", (event) => {
  if (isMouseDown) {
    const note = randomNote();
    lastNote = note;
    const line = new Line(lastX - translateX, lastY, event.clientX - translateX, event.clientY, "red", ctx, note, monPiano);
  
    allLines.push(line);
   if(!playedNote){ 
      console.log("played")
      monPiano.sampler.triggerAttackRelease(note, "1n", "+0.1");
    }
    lastX = event.clientX;
    lastY = event.clientY;
    playedNote = true;
  }
});


function drawButton() {
  ctx.fillStyle = 'red';
  ctx.fillRect(1400, canvas.height - 130, 100, 40);
}

function drawStopButton() {
  ctx.fillStyle = 'blue';
  ctx.fillRect(800, canvas.height - 130, 100, 40);
}

function drawLeftButton() {
  ctx.fillStyle = 'green';
  ctx.fillRect(75, canvas.height - 130, 100, 40);
}

function drawIconButton() {
  ctx.fillStyle = 'white';
  ctx.fillRect(2040, canvas.height - 215, 215, 215);
}


function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (imgInterface.complete) {
    ctx.drawImage(imgInterface, 0, 0, canvas.width, canvas.height);
  }

  if (buttonClicked) {
    translateX += 100; 
    buttonClicked = false; 
  } else if (canvasMoving) {
    translateX -= 2; 
  } else if (buttonClickedLeft) {
    translateX -= 100;
    buttonClickedLeft = false; 
  }

  ctx.setTransform(1, 0, 0, 1, translateX, 0);

  allLines.forEach((line) => {
    line.draw();
    
  });

  ctx.setTransform(1, 0, 0, 1, 0, 0);

  requestAnimationFrame(draw);
  drawButton();
  drawStopButton();
  drawLeftButton();
  drawIconButton();
}

draw();
setVolume();
function setVolume() {
  monPiano.sampler.volume.value = -30;
}