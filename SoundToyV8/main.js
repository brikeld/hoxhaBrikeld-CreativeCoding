import Piano from "./js/piano";
import midiNote from "midi-note";
import MidiPlayer from "./js/MidiPlayer";
import Line from "./js/Line";
import DottedLine from "./js/DottedLine"; // Import DottedLine class
import Circle from "./js/Circle";
import PlayFunction from "./js/PlayFunction";

let buttonClicked = false;
let canvasMoving = true;
let buttonClickedLeft = false;
let translateX = 0;
let lastNote = null;
let isMouseDown = false;
let useDottedLine = false; // Add a flag to track the current line type
let currentIconIndex = 0; // Add a variable to track the current icon index
let isDraggingIcon = false; // Track if an icon is being dragged
let draggedIcon = null; // Store the currently dragged icon

const canvas = document.getElementsByTagName("canvas")[0];
canvas.width = document.body.clientWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");
const noteDelay = 200;
const monPiano = new Piano();
const allLines = [];
const placedIcons = []; // Array to store placed icons
const imgInterface = new Image();
imgInterface.src = '/interfacciaNERA.png';

const iconImages = [];
const totalIcons = 13;
for (let i = 1; i <= totalIcons; i++) {
  const img = new Image();
  img.src = `/icons/icon (${i}).png`;
  iconImages.push(img);
}

// Define button positions and sizes relative to the canvas
const buttonPositions = {
  right: { x: 0.80, y: 0.91, width: 0.03, height: 0.03 },
  stop: { x: 0.44, y: 0.91, width: 0.03, height: 0.03 },
  left: { x: 0.05, y: 0.91, width: 0.03, height: 0.03 },
  PlayButton: { x: 0.88, y: 0.8, width: 0.080, height: 0.11 },
  LineButton: { x: 0.868, y: 0.05, width: 0.099, height: 0.13 },
  iconButton: { x: 0.868, y: 0.18, width: 0.099, height: 0.13 }
};

function setCanvasResolution(canvas, ctx, scaleFactor) {
  const width = document.body.clientWidth;
  const height = window.innerHeight;

  canvas.width = width * scaleFactor;
  canvas.height = height * scaleFactor;

  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  ctx.scale(scaleFactor, scaleFactor);
}

// Define the drawing area (rectangle)
const drawingArea = {
  x: canvas.width / 27,
  y: canvas.height / 20,
  width: canvas.width / 1.245,
  height: canvas.height / 1.259
};

canvas.addEventListener("click", (event) => {
  const rect = canvas.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width;
  const y = (event.clientY - rect.top) / rect.height;

  // Right button
  if (x >= buttonPositions.right.x && x <= buttonPositions.right.x + buttonPositions.right.width
      && y >= buttonPositions.right.y && y <= buttonPositions.right.y + buttonPositions.right.height) {
    buttonClicked = true;
    console.log("right button clicked");
  }

  // Stop button
  if (x >= buttonPositions.stop.x && x <= buttonPositions.stop.x + buttonPositions.stop.width
      && y >= buttonPositions.stop.y && y <= buttonPositions.stop.y + buttonPositions.stop.height) {
    canvasMoving = !canvasMoving;
    console.log("stop button clicked");
  }

  // Left button
  if (x >= buttonPositions.left.x && x <= buttonPositions.left.x + buttonPositions.left.width
      && y >= buttonPositions.left.y && y <= buttonPositions.left.y + buttonPositions.left.height) {
    buttonClickedLeft = true;
    console.log("left button clicked");
  }

  // play button
  if (x >= buttonPositions.PlayButton.x && x <= buttonPositions.PlayButton.x + buttonPositions.PlayButton.width
    && y >= buttonPositions.PlayButton.y && y <= buttonPositions.PlayButton.y + buttonPositions.PlayButton.height) {
  console.log("new white circle button clicked");
  PlayFunction(allLines, monPiano);
}

// Line button
if (x >= buttonPositions.LineButton.x && x <= buttonPositions.LineButton.x + buttonPositions.LineButton.width
  && y >= buttonPositions.LineButton.y && y <= buttonPositions.LineButton.y + buttonPositions.LineButton.height) {
console.log("LineButton clicked");
useDottedLine = !useDottedLine; // Toggle the line type
}

// Icon button
if (x >= buttonPositions.iconButton.x && x <= buttonPositions.iconButton.x + buttonPositions.iconButton.width
  && y >= buttonPositions.iconButton.y && y <= buttonPositions.iconButton.y + buttonPositions.iconButton.height) {
console.log("iconButton clicked");
isDraggingIcon = true; // Start dragging the icon
draggedIcon = { img: iconImages[currentIconIndex], x: event.clientX, y: event.clientY };
}
});

canvas.addEventListener("mousewheel", (event) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = (event.clientX - rect.left) / rect.width;
  const mouseY = (event.clientY - rect.top) / rect.height;

  // Check if the mouse is over the icon button
  if (mouseX >= buttonPositions.iconButton.x && mouseX <= buttonPositions.iconButton.x + buttonPositions.iconButton.width
      && mouseY >= buttonPositions.iconButton.y && mouseY <= buttonPositions.iconButton.y + buttonPositions.iconButton.height) {
    if (event.deltaY < 0) {
      // Scroll up
      currentIconIndex = (currentIconIndex - 1 + totalIcons) % totalIcons;
    } else {
      // Scroll down
      currentIconIndex = (currentIconIndex + 1) % totalIcons;
    }
    event.preventDefault(); // Prevent the default scroll behavior
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
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  if (mouseX >= drawingArea.x && mouseX <= drawingArea.x + drawingArea.width &&
      mouseY >= drawingArea.y && mouseY <= drawingArea.y + drawingArea.height) {
    isMouseDown = true;
    lastX = mouseX;
    lastY = mouseY;
    const note = randomNote();
    lastNote = note;
    // monPiano.sampler.triggerAttack(note);
  }
});

canvas.addEventListener("mouseup", (event) => {
  isMouseDown = false;
  if (lastNote) {
    // monPiano.sampler.triggerRelease(lastNote);
  }
  playedNote = false;

  if (isDraggingIcon) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // Check if the mouse is within the drawing area
    if (mouseX >= drawingArea.x && mouseX <= drawingArea.x + drawingArea.width &&
        mouseY >= drawingArea.y && mouseY <= drawingArea.y + drawingArea.height) {
      placedIcons.push({ img: draggedIcon.img, x: mouseX - translateX, y: mouseY });
      const note = randomNote();
      monPiano.sampler.triggerAttackRelease(note, "1n", "+0.1");
    }
    isDraggingIcon = false;
    draggedIcon = null;
  }
});

canvas.addEventListener("mousemove", (event) => {
  if (isMouseDown) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    if (mouseX >= drawingArea.x && mouseX <= drawingArea.x + drawingArea.width &&
        mouseY >= drawingArea.y && mouseY <= drawingArea.y + drawingArea.height) {
      const note = randomNote();
      lastNote = note;
      let line;
      if (useDottedLine) {
        line = new DottedLine(lastX - translateX, lastY, mouseX - translateX, mouseY, "black", ctx, note, monPiano);
      } else {
        line = new Line(lastX - translateX, lastY, mouseX - translateX, mouseY, "red", ctx, note, monPiano);
      }
      allLines.push(line);
      if (!playedNote) {
        console.log("played");
        monPiano.sampler.triggerAttackRelease(note, "1n", "+0.1");
      }
      lastX = mouseX;
      lastY = mouseY;
      playedNote = true;
    }
  }

  if (isDraggingIcon) {
    draggedIcon.x = event.clientX;
    draggedIcon.y = event.clientY;
  }
});

function drawButton() {
  ctx.fillStyle = 'red';
  ctx.fillRect(buttonPositions.right.x * canvas.width, buttonPositions.right.y * canvas.height, buttonPositions.right.width * canvas.width, buttonPositions.right.height * canvas.height);
}

function drawStopButton() {
  ctx.fillStyle = 'blue';
  ctx.fillRect(buttonPositions.stop.x * canvas.width, buttonPositions.stop.y * canvas.height, buttonPositions.stop.width * canvas.width, buttonPositions.stop.height * canvas.height);
}

function drawLeftButton() {
  ctx.fillStyle = 'green';
  ctx.fillRect(buttonPositions.left.x * canvas.width, buttonPositions.left.y * canvas.height, buttonPositions.left.width * canvas.width, buttonPositions.left.height * canvas.height);
}

function drawPlayButton() {
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.arc(
    buttonPositions.PlayButton.x * canvas.width + (buttonPositions.PlayButton.width * canvas.width) / 2,
    buttonPositions.PlayButton.y * canvas.height + (buttonPositions.PlayButton.height * canvas.height) / 2,
    (buttonPositions.PlayButton.width * canvas.width) / 2,
    0, Math.PI * 2
  );
  ctx.fill();
}

function drawLineButton() {
  ctx.fillStyle = 'yellow';
  ctx.fillRect(buttonPositions.LineButton.x * canvas.width, buttonPositions.LineButton.y * canvas.height, buttonPositions.LineButton.width * canvas.width, buttonPositions.LineButton.height * canvas.height);
}

function drawIconButton() {
  ctx.fillStyle = 'orange';
  ctx.fillRect(buttonPositions.iconButton.x * canvas.width, buttonPositions.iconButton.y * canvas.height, buttonPositions.iconButton.width * canvas.width, buttonPositions.iconButton.height * canvas.height);
  
  // Draw the current icon image inside the icon button
  const iconRect = {
    x: buttonPositions.iconButton.x * canvas.width,
    y: buttonPositions.iconButton.y * canvas.height,
    width: buttonPositions.iconButton.width * canvas.width,
    height: buttonPositions.iconButton.height * canvas.height
  };

  const currentIcon = iconImages[currentIconIndex];
  if (currentIcon.complete) {
    ctx.drawImage(currentIcon, iconRect.x, iconRect.y, iconRect.width, iconRect.height);
  }
}

function drawDrawingArea() {
  ctx.strokeStyle = 'red';
  ctx.lineWidth = 4;
  ctx.strokeRect(drawingArea.x, drawingArea.y, drawingArea.width, drawingArea.height);
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

  placedIcons.forEach(icon => {
    ctx.drawImage(icon.img, icon.x + translateX, icon.y, icon.img.width, icon.img.height);
  });

  ctx.setTransform(1, 0, 0, 1, 0, 0);

  drawButton();
  drawStopButton();
  drawLeftButton();
  drawPlayButton();
  drawDrawingArea();
  drawLineButton(); 
  drawIconButton(); // Draw the icon button with the current icon

  if (isDraggingIcon && draggedIcon) {
    ctx.drawImage(draggedIcon.img, draggedIcon.x - draggedIcon.img.width / 2, draggedIcon.y - draggedIcon.img.height / 2);
  }

  requestAnimationFrame(draw);
}

draw();

function setVolume() {
  monPiano.sampler.volume.value = -1;
}
