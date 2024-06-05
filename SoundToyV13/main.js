import Piano from "./js/piano";
import midiNote from "midi-note";
import MidiPlayer from "./js/MidiPlayer";
import Line from "./js/Line";
import DottedLine from "./js/DottedLine";
import Circle from "./js/Circle";
import PlayFunction from "./js/PlayFunction";
import Undo from "./js/Undo"; 
import * as SEGMENT from "./js/Segment"; 
import DemoFunction from "./js/DemoFunction"; 
import * as Tone from 'tone';

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

const playedSounds = []; 

let buttonClicked = false;
let canvasMoving = true;
let buttonClickedLeft = false;
let translateX = 0;
let lastNote = null;
let isMouseDown = false;
let useDottedLine = false;

let currentIconIndex = 0;
let currentTextButtonIndex = 0;

let isDraggingIcon = false;
let draggedIcon = null;

let isDraggingText = false;
let draggedText = null;

const undoButtonImage = new Image();
undoButtonImage.src = "undoPNG/undo.png";

const lineFillImage = new Image();
lineFillImage.src = "linesFill/fill.png";

const dottedLineFillImage = new Image();
dottedLineFillImage.src = "linesFill/fill.png"; 

const canvas = document.getElementsByTagName("canvas")[0];
canvas.width = document.body.clientWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");
const noteDelay = 200;
const monPiano = new Piano();
const allLines = [];
const placedIcons = [];
const placedTexts = [];

const imgInterface = new Image();
imgInterface.src = "/interfaceSoundToy.png";

const iconImages = [];
const totalIcons = 8;
for (let i = 1; i <= totalIcons; i++) {
  const img = new Image();
  img.src = `/OnlyIcons/icon (${i}).png`;
  iconImages.push(img);
}

const textButtonImages = [];
for (let i = 1; i <= 7; i++) {
  const img = new Image();
  img.src = `OnlyText/text (${i}).png`;
  textButtonImages.push(img);
}

Promise.all([
  ...iconImages.map(img => new Promise(resolve => img.onload = resolve)),
  ...textButtonImages.map(img => new Promise(resolve => img.onload = resolve))
]).then(() => {
  console.log('All images loaded');
}).catch((error) => {
  console.error('Error loading images:', error);
});

let currentLineButtonIndex = 0;
const lineButtonImages = [];
const totalLineButtons = 2;
for (let i = 1; i <= totalLineButtons; i++) {
  let img = new Image();
  img.src = `lineaPNG/line (${i}).png`;
  lineButtonImages.push(img);
}

const buttonPositions = {
  right: { x: 0.8, y: 0.91, width: 0.03, height: 0.03 },
  stop: { x: 0.44, y: 0.91, width: 0.03, height: 0.03 },
  left: { x: 0.05, y: 0.91, width: 0.03, height: 0.03 },
  LineButton: { x: 0.868, y: 0.05, width: 0.096, height: 0.123 },  
  textButton: { x: 0.868, y: 0.322, width: 0.096, height: 0.123 },
  iconButton: { x: 0.868, y: 0.187, width: 0.096, height: 0.123 },
  UndoButton: { x: 0.868, y: 0.459, width: 0.096, height: 0.123 },
  DemoButton: { x: 0.868, y: 0.6, width: 0.096, height: 0.123 }, 
  PlayButton: { x: 0.873, y: 0.8, width: 0.09, height: 0.11 },
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

const drawingArea = {
  x: canvas.width / 27,
  y: canvas.height / 20,
  width: canvas.width / 1.245,
  height: canvas.height / 1.259,
};

function setCanvasMoving(value) {
  canvasMoving = value;
}

canvas.addEventListener("click", (event) => {
  const rect = canvas.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width;
  const y = (event.clientY - rect.top) / rect.height;

  if (
    x >= buttonPositions.right.x &&
    x <= buttonPositions.right.x + buttonPositions.right.width &&
    y >= buttonPositions.right.y &&
    y <= buttonPositions.right.y + buttonPositions.right.height
  ) {
    buttonClicked = true;
    console.log("right button clicked");
  }

  if (
    x >= buttonPositions.stop.x &&
    x <= buttonPositions.stop.x + buttonPositions.stop.width &&
    y >= buttonPositions.stop.y &&
    y <= buttonPositions.stop.y + buttonPositions.stop.height
  ) {
    setCanvasMoving(!canvasMoving);
    console.log("stop button clicked");
  }

  if (
    x >= buttonPositions.left.x &&
    x <= buttonPositions.left.x + buttonPositions.left.width &&
    y >= buttonPositions.left.y &&
    y <= buttonPositions.left.y + buttonPositions.left.height
  ) {
    buttonClickedLeft = true;
    console.log("left button clicked");
  }

  if (
    x >= buttonPositions.PlayButton.x &&
    x <= buttonPositions.PlayButton.x + buttonPositions.PlayButton.width &&
    y >= buttonPositions.PlayButton.y &&
    y <= buttonPositions.PlayButton.y + buttonPositions.PlayButton.height
  ) {
    console.log("playButton clicked");
    stopCanvasAnimation();
    PlayFunction(playedSounds, monPiano, allLines, placedIcons, placedTexts, ctx, canvas.width, translateX);
  }

  if (
    x >= buttonPositions.textButton.x &&
    x <= buttonPositions.textButton.x + buttonPositions.textButton.width &&
    y >= buttonPositions.textButton.y &&
    y <= buttonPositions.textButton.y + buttonPositions.textButton.height
  ) {
    console.log("textButton clicked");
    isDraggingText = true;
    draggedText = { img: textButtonImages[currentTextButtonIndex], x: event.clientX, y: event.clientY };
    isMouseDown = false;
  }

  if (
    x >= buttonPositions.iconButton.x &&
    x <= buttonPositions.iconButton.x + buttonPositions.iconButton.width &&
    y >= buttonPositions.iconButton.y &&
    y <= buttonPositions.iconButton.y + buttonPositions.iconButton.height
  ) {
    console.log("iconButton clicked");
    isDraggingIcon = true;
    draggedIcon = {
      img: iconImages[currentIconIndex],
      x: event.clientX,
      y: event.clientY,
    };
    isMouseDown = false;
  }

  if (
    x >= buttonPositions.UndoButton.x &&
    x <= buttonPositions.UndoButton.x + buttonPositions.UndoButton.width &&
    y >= buttonPositions.UndoButton.y &&
    y <= buttonPositions.UndoButton.y + buttonPositions.UndoButton.height
  ) {
    console.log("UndoButton clicked");
    Undo(allLines, placedIcons, placedTexts, playedSounds);
  }

  if (
    x >= buttonPositions.LineButton.x &&
    x <= buttonPositions.LineButton.x + buttonPositions.LineButton.width &&
    y >= buttonPositions.LineButton.y &&
    y <= buttonPositions.LineButton.y + buttonPositions.LineButton.height
  ) {
    console.log("LineButton clicked");
    useDottedLine = !useDottedLine;
  }

  if (
    x >= buttonPositions.DemoButton.x &&
    x <= buttonPositions.DemoButton.x + buttonPositions.DemoButton.width &&
    y >= buttonPositions.DemoButton.y &&
    y <= buttonPositions.DemoButton.y + buttonPositions.DemoButton.height
  ) {
    console.log("DemoButton clicked");
    DemoFunction(monPiano, canvas, ctx, placedIcons, iconImages, textButtonImages, translateX);
  }
});

canvas.addEventListener("mousewheel", (event) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = (event.clientX - rect.left) / rect.width;
  const mouseY = (event.clientY - rect.top) / rect.height;

  if (
    mouseX >= buttonPositions.iconButton.x &&
    mouseX <= buttonPositions.iconButton.x + buttonPositions.iconButton.width &&
    mouseY >= buttonPositions.iconButton.y &&
    mouseY <= buttonPositions.iconButton.y + buttonPositions.iconButton.height
  ) {
    if (event.deltaY < 0) {
      currentIconIndex = (currentIconIndex - 1 + totalIcons) % totalIcons;
    } else {
      currentIconIndex = (currentIconIndex + 1) % totalIcons;
    }
    event.preventDefault();
  }

  if (
    mouseX >= buttonPositions.textButton.x &&
    mouseX <= buttonPositions.textButton.x + buttonPositions.textButton.width &&
    mouseY >= buttonPositions.textButton.y &&
    mouseY <= buttonPositions.textButton.y + buttonPositions.textButton.height
  ) {
    if (event.deltaY < 0) {
      currentTextButtonIndex =
        (currentTextButtonIndex - 1 + textButtonImages.length) %
        textButtonImages.length;
    } else {
      currentTextButtonIndex =
        (currentTextButtonIndex + 1) % textButtonImages.length;
    }
    event.preventDefault();
  }

  if (
    mouseX >= buttonPositions.LineButton.x &&
    mouseX <= buttonPositions.LineButton.x + buttonPositions.LineButton.width &&
    mouseY >= buttonPositions.LineButton.y &&
    mouseY <= buttonPositions.LineButton.y + buttonPositions.LineButton.height
  ) {
    if (event.deltaY < 0) {
      currentLineButtonIndex =
        (currentLineButtonIndex - 1 + totalLineButtons) % totalLineButtons;
    } else {
      currentLineButtonIndex =
        (currentLineButtonIndex + 1) % totalLineButtons;
    }
    event.preventDefault();
  }
});

imgInterface.onload = function () {
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

let lastX = null;
let lastY = null;
let playedNote = false;

canvas.addEventListener("mousedown", handleMouseDown);
canvas.addEventListener("mousemove", handleMouseMove);
canvas.addEventListener("mouseup", handleMouseUp);

function handleMouseDown(event) {
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  if (
    mouseX >= drawingArea.x &&
    mouseX <= drawingArea.x + drawingArea.width &&
    mouseY >= drawingArea.y &&
    mouseY <= drawingArea.y + drawingArea.height
  ) {
    SEGMENT.startSegment();
    isMouseDown = true;
    lastX = mouseX;
    lastY = mouseY;
  }
}

canvas.addEventListener("mousemove", handleMouseMove);

function handleMouseMove(event) {
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  if (isMouseDown && !isDraggingIcon && !isDraggingText) {
    if (
      mouseX >= drawingArea.x &&
      mouseX <= drawingArea.x + drawingArea.width &&
      mouseY >= drawingArea.y &&
      mouseY <= drawingArea.y + drawingArea.height
    ) {
      let line;
      if (useDottedLine) {
        line = new DottedLine(
          lastX - translateX,
          lastY,
          mouseX - translateX,
          mouseY,
          ctx,
          null,
          monPiano,
          dottedLineFillImage
        );
        // Only play the sound for the first segment
        if (!playedNote && monPiano.lineSamplerLoaded) {
          monPiano.playLineSound(true);
          playedSounds.push({ note: 'C2', element: line, type: 'line' });
          playedNote = true;
        }
      } else {
        line = new Line(
          lastX - translateX,
          lastY,
          mouseX - translateX,
          mouseY,
          ctx,
          null,
          monPiano,
          lineFillImage
        );
        // Only play the sound for the first segment
        if (!playedNote && monPiano.lineSamplerLoaded) {
          monPiano.playLineSound(false);
          playedSounds.push({ note: 'C1', element: line, type: 'line' });
          playedNote = true;
        }
      }
      allLines.push(line);
      SEGMENT.addLine(line);
      lastX = mouseX;
      lastY = mouseY;
    }
  }

  if (isDraggingIcon && draggedIcon) {
    draggedIcon.x = mouseX;
    draggedIcon.y = mouseY;
  }

  if (isDraggingText && draggedText) {
    draggedText.x = mouseX;
    draggedText.y = mouseY;
  }
}

function handleMouseUp(event) {
  isMouseDown = false;
  playedNote = false; // Reset playedNote for the next line

  if (isDraggingIcon) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    if (
      mouseX >= drawingArea.x &&
      mouseX <= drawingArea.x + drawingArea.width &&
      mouseY >= drawingArea.y &&
      mouseY <= drawingArea.y + drawingArea.height
    ) {
      placedIcons.push({
        img: draggedIcon.img,
        x: mouseX - translateX - draggedIcon.img.width / 2, 
        y: mouseY - draggedIcon.img.height / 2,
      });
      monPiano.playIconSound(currentIconIndex);
      playedSounds.push({ note: `C${currentIconIndex + 1}`, element: draggedIcon, type: 'icon' });
    }
    isDraggingIcon = false;
    draggedIcon = null;
  }

  if (isDraggingText) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    if (
      mouseX >= drawingArea.x &&
      mouseX <= drawingArea.x + drawingArea.width &&
      mouseY >= drawingArea.y &&
      mouseY <= drawingArea.y + drawingArea.height
    ) {
      placedTexts.push({
        img: draggedText.img,
        x: mouseX - translateX - draggedText.img.width / 2,
        y: mouseY - draggedText.img.height / 2,
      });
      monPiano.playTextSound(currentTextButtonIndex);
      playedSounds.push({ note: `C${currentTextButtonIndex + 1}`, element: draggedText, type: 'text' });
    }
    isDraggingText = false;
    draggedText = null;
  }
}

function stopCanvasAnimation() {
  canvasMoving = false;
  buttonClicked = false;
  buttonClickedLeft = false;
}

function drawButton() {
}

function drawStopButton() {
}

function drawLeftButton() {
}

function drawDemoButton() {
  const buttonWidth = buttonPositions.DemoButton.width * canvas.width;
  const buttonHeight = buttonPositions.DemoButton.height * canvas.height;

  ctx.beginPath();
  ctx.rect(
    buttonPositions.DemoButton.x * canvas.width,
    buttonPositions.DemoButton.y * canvas.height,
    buttonWidth,
    buttonHeight
  );
  ctx.strokeStyle = "red";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.closePath();
}

function drawPlayButton() {
}

function drawLineButton() {
  const buttonWidth = buttonPositions.LineButton.width * canvas.width;
  const buttonHeight = buttonPositions.LineButton.height * canvas.height;

  const lineRect = {
    x: buttonPositions.LineButton.x * canvas.width,
    y: buttonPositions.LineButton.y * canvas.height,
    width: buttonWidth,
    height: buttonHeight,
  };

  const currentLineButtonImage = lineButtonImages[currentLineButtonIndex];
  if (currentLineButtonImage.complete) {
    ctx.drawImage(
      currentLineButtonImage,
      lineRect.x,
      lineRect.y,
      lineRect.width,
      lineRect.height
    );
  }
}

function drawIconButton() {
  const buttonWidth = buttonPositions.iconButton.width * canvas.width;
  const buttonHeight = buttonPositions.iconButton.height * canvas.height;

  const iconRect = {
    x: buttonPositions.iconButton.x * canvas.width,
    y: buttonPositions.iconButton.y * canvas.height,
    width: buttonWidth,
    height: buttonHeight,
  };

  const currentIcon = iconImages[currentIconIndex];
  if (currentIcon.complete) {
    ctx.drawImage(
      currentIcon,
      iconRect.x,
      iconRect.y,
      iconRect.width,
      iconRect.height
    );
  }
}

function drawTextButton() {
  const buttonWidth = buttonPositions.textButton.width * canvas.width;
  const buttonHeight = buttonPositions.textButton.height * canvas.height;

  const textRect = {
    x: buttonPositions.textButton.x * canvas.width,
    y: buttonPositions.textButton.y * canvas.height,
    width: buttonWidth,
    height: buttonHeight,
  };

  const currentTextButtonImage = textButtonImages[currentTextButtonIndex];
  if (currentTextButtonImage.complete) {
    ctx.drawImage(
      currentTextButtonImage,
      textRect.x,
      textRect.y,
      textRect.width,
      textRect.height
    );
  }
}

function drawUndoButton() {
  const buttonWidth = buttonPositions.UndoButton.width * canvas.width;
  const buttonHeight = buttonPositions.UndoButton.height * canvas.height;

  if (undoButtonImage.complete) {
    ctx.drawImage(
      undoButtonImage,
      buttonPositions.UndoButton.x * canvas.width,
      buttonPositions.UndoButton.y * canvas.height,
      buttonWidth,
      buttonHeight
    );
  }
}

function drawDrawingArea() {
  // Draw drawing area here
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.save();

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (imgInterface.complete) {
    ctx.drawImage(imgInterface, 0, 0, canvas.width, canvas.height);
  }

  ctx.beginPath();
  // clip drawing area
  ctx.rect(drawingArea.x, drawingArea.y, drawingArea.width, drawingArea.height);
  ctx.clip();

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

  placedIcons.forEach((icon) => {
    ctx.drawImage(
      icon.img,
      icon.x + 0,
      icon.y,
      icon.img.width,
      icon.img.height
    );
  });

  placedTexts.forEach((text) => {
    ctx.drawImage(
      text.img,
      text.x + 0,
      text.y,
      text.img.width,
      text.img.height
    );
  });

  ctx.setTransform(1, 0, 0, 1, 0, 0);

  ctx.restore();

  drawButton();
  drawStopButton();
  drawLeftButton();
  drawPlayButton();
  drawDrawingArea();
  drawLineButton(); 
  drawIconButton();
  drawTextButton();
  drawUndoButton();
  drawDemoButton(); // Draw the new DemoButton

  if (isDraggingIcon && draggedIcon) {
    ctx.drawImage(
      draggedIcon.img,
      draggedIcon.x - draggedIcon.img.width / 2,
      draggedIcon.y - draggedIcon.img.height / 2
    );
  }

  if (isDraggingText && draggedText) {
    ctx.drawImage(
      draggedText.img,
      draggedText.x - draggedText.img.width / 2,
      draggedText.y - draggedText.img.height / 2
    );
  }

  requestAnimationFrame(draw);
}

draw();

initializeBackgroundAudio("drums2.mp3");
setBackgroundAudioVolume(-40);
