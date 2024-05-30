import Piano from "./js/piano";
import midiNote from "midi-note";
import MidiPlayer from "./js/MidiPlayer";
import Line from "./js/Line";
import DottedLine from "./js/DottedLine";
import Circle from "./js/Circle";
import PlayFunction from "./js/PlayFunction";

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

const canvas = document.getElementsByTagName("canvas")[0];
canvas.width = document.body.clientWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");
const noteDelay = 200;
const monPiano = new Piano();
const allLines = [];
const placedIcons = [];
const imgInterface = new Image();
imgInterface.src = "/interfaceSoundToy.png";
const placedTexts = [];

const iconImages = [];
const totalIcons = 14;
for (let i = 1; i <= totalIcons; i++) {
  const img = new Image();
  img.src = `/icons/icon (${i}).png`;
  iconImages.push(img);
}

let textButtonImages = [];
for (let i = 1; i <= 13; i++) {
  let img = new Image();
  img.src = `textImg/text (${i}).png`;
  textButtonImages.push(img);
}

// Define button positions and sizes relative to the canvas
const buttonPositions = {
  right: { x: 0.8, y: 0.91, width: 0.03, height: 0.03 },
  stop: { x: 0.44, y: 0.91, width: 0.03, height: 0.03 },
  left: { x: 0.05, y: 0.91, width: 0.03, height: 0.03 },
  LineButton: { x: 0.868, y: 0.05, width: 0.096, height: 0.123 },  

  textButton: { x: 0.868, y: 0.322, width: 0.096, height: 0.123 },

  iconButton: { x: 0.5, y: 0.322, width: 0.096, height: 0.123 },




  EraseButton: { x: 0.868, y: 0.459, width: 0.096, height: 0.123 },
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

// Define the drawing area (rectangle)
const drawingArea = {
  x: canvas.width / 27,
  y: canvas.height / 20,
  width: canvas.width / 1.245,
  height: canvas.height / 1.259,
};

canvas.addEventListener("click", (event) => {
  const rect = canvas.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width;
  const y = (event.clientY - rect.top) / rect.height;

  // Right button
  if (
    x >= buttonPositions.right.x &&
    x <= buttonPositions.right.x + buttonPositions.right.width &&
    y >= buttonPositions.right.y &&
    y <= buttonPositions.right.y + buttonPositions.right.height
  ) {
    buttonClicked = true;
    console.log("right button clicked");
  }

  // Stop button
  if (
    x >= buttonPositions.stop.x &&
    x <= buttonPositions.stop.x + buttonPositions.stop.width &&
    y >= buttonPositions.stop.y &&
    y <= buttonPositions.stop.y + buttonPositions.stop.height
  ) {
    canvasMoving = !canvasMoving;
    console.log("stop button clicked");
  }

  // Left button
  if (
    x >= buttonPositions.left.x &&
    x <= buttonPositions.left.x + buttonPositions.left.width &&
    y >= buttonPositions.left.y &&
    y <= buttonPositions.left.y + buttonPositions.left.height
  ) {
    buttonClickedLeft = true;
    console.log("left button clicked");
  }

  // Play button
  if (
    x >= buttonPositions.PlayButton.x &&
    x <= buttonPositions.PlayButton.x + buttonPositions.PlayButton.width &&
    y >= buttonPositions.PlayButton.y &&
    y <= buttonPositions.PlayButton.y + buttonPositions.PlayButton.height
  ) {
    console.log("new white circle button clicked");
    stopCanvasAnimation();
    startPlayback();
  }

  if (
    x >= buttonPositions.textButton.x &&
    x <= buttonPositions.textButton.x + buttonPositions.textButton.width &&
    y >= buttonPositions.textButton.y &&
    y <= buttonPositions.textButton.y + buttonPositions.textButton.height
  ) {
    console.log("textButton clicked");
    isDraggingText = true; // Start dragging the text
    draggedText = { img: textButtonImages[currentTextButtonIndex], x: event.clientX, y: event.clientY };
    isMouseDown = false; // Ensure that lines are not drawn when dragging text
  }

  // Check if icon button is clicked
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
    isMouseDown = false; // Ensure that lines are not drawn when dragging icon
  }
  
  // Line button
  if (
    x >= buttonPositions.LineButton.x &&
    x <= buttonPositions.LineButton.x + buttonPositions.LineButton.width &&
    y >= buttonPositions.LineButton.y &&
    y <= buttonPositions.LineButton.y + buttonPositions.LineButton.height
  ) {
    console.log("LineButton clicked");
    useDottedLine = !useDottedLine; // Toggle the line type
  }
});

canvas.addEventListener("mousewheel", (event) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = (event.clientX - rect.left) / rect.width;
  const mouseY = (event.clientY - rect.top) / rect.height;

  // Check if the mouse is over the icon button
  if (
    mouseX >= buttonPositions.iconButton.x &&
    mouseX <= buttonPositions.iconButton.x + buttonPositions.iconButton.width &&
    mouseY >= buttonPositions.iconButton.y &&
    mouseY <= buttonPositions.iconButton.y + buttonPositions.iconButton.height
  ) {
    if (event.deltaY < 0) {
      // Scroll up
      currentIconIndex = (currentIconIndex - 1 + totalIcons) % totalIcons;
    } else {
      // Scroll down
      currentIconIndex = (currentIconIndex + 1) % totalIcons;
    }
    event.preventDefault(); // Prevent the default scroll behavior
  }

  // Check if the mouse is over the text button
  if (
    mouseX >= buttonPositions.textButton.x &&
    mouseX <= buttonPositions.textButton.x + buttonPositions.textButton.width &&
    mouseY >= buttonPositions.textButton.y &&
    mouseY <= buttonPositions.textButton.y + buttonPositions.textButton.height
  ) {
    if (event.deltaY < 0) {
      // Scroll up
      currentTextButtonIndex =
        (currentTextButtonIndex - 1 + textButtonImages.length) %
        textButtonImages.length;
    } else {
      // Scroll down
      currentTextButtonIndex =
        (currentTextButtonIndex + 1) % textButtonImages.length;
    }
    event.preventDefault(); // Prevent the default scroll behavior
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

function randomNote() {
  const notes = ["C", "D", "E", "F", "G", "A", "B"];
  const octaves = ["2", "3", "4", "5", "6"];
  return (
    notes[Math.floor(Math.random() * notes.length)] +
    octaves[Math.floor(Math.random() * octaves.length)]
  );
}

let lastX = null;
let lastY = null;
let playedNote = false;
let lastNoteIcon = null; // New variable to track last note for icons
let lastNoteText = null; // New variable to track last note for texts

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
    isMouseDown = true;
    lastX = mouseX;
    lastY = mouseY;
    if (!playedNote && !isDraggingIcon && !isDraggingText) { // Ensure a note is only generated once per interaction
      const note = randomNote();
      lastNote = note;
      console.log("Adding note to playedSounds in mousedown: " + note);
      playedSounds.push(note); // Store the note in the array
      monPiano.sampler.triggerAttack(note);
      playedNote = true;
    }
  }

  // Check if text button is clicked
  if (
    mouseX >= buttonPositions.textButton.x * canvas.width &&
    mouseX <= buttonPositions.textButton.x * canvas.width + buttonPositions.textButton.width * canvas.width &&
    mouseY >= buttonPositions.textButton.y * canvas.height &&
    mouseY <= buttonPositions.textButton.y * canvas.height + buttonPositions.textButton.height * canvas.height
  ) {
    console.log("textButton clicked");
    isDraggingText = true;
    draggedText = {
      img: textButtonImages[currentTextButtonIndex],
      x: mouseX,
      y: mouseY,
    };
    isMouseDown = false; // Ensure that lines are not drawn when dragging text
  }

  // Check if icon button is clicked
  if (
    mouseX >= buttonPositions.iconButton.x &&
    mouseX <= buttonPositions.iconButton.x + buttonPositions.iconButton.width &&
    mouseY >= buttonPositions.iconButton.y &&
    mouseY <= buttonPositions.iconButton.y + buttonPositions.iconButton.height
  ) {
    console.log("iconButton clicked");
    isDraggingIcon = true;
    draggedIcon = {
      img: iconImages[currentIconIndex],
      x: event.clientX,
      y: event.clientY,
    };
    isMouseDown = false; // Ensure that lines are not drawn when dragging icon
  }
}

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
          "black",
          ctx,
          lastNote, // Use the last generated note
          monPiano
        );
      } else {
        line = new Line(
          lastX - translateX,
          lastY,
          mouseX - translateX,
          mouseY,
          "red",
          ctx,
          lastNote, // Use the last generated note
          monPiano
        );
      }
      allLines.push(line);
      if (!playedNote) {
        console.log("played in mousemove: " + lastNote);
        monPiano.sampler.triggerAttackRelease(lastNote, "1n", "+0.1");
        console.log("Adding note to playedSounds in mousemove: " + lastNote);
        playedSounds.push(lastNote); // Store the note in the array
        playedNote = true;
      }
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
  if (lastNote) {
    monPiano.sampler.triggerRelease(lastNote);
  }
  playedNote = false;

  if (isDraggingIcon) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // Check if the mouse is within the drawing area
    if (
      mouseX >= drawingArea.x &&
      mouseX <= drawingArea.x + drawingArea.width &&
      mouseY >= drawingArea.y &&
      mouseY <= drawingArea.y + drawingArea.height
    ) {
      placedIcons.push({
        img: draggedIcon.img,
        x: mouseX - translateX,
        y: mouseY,
      });
      if (!playedNote) { // Ensure a note is only generated once per interaction
        const note = randomNote();
        lastNoteIcon = note;
        console.log("played in mouseup for icon: " + note);
        monPiano.sampler.triggerAttackRelease(note, "1n", "+0.1");
        console.log("Adding note to playedSounds for icon: " + note);
        playedSounds.push(note); // Store the note in the array
        playedNote = true;
      }
    }
    isDraggingIcon = false;
    draggedIcon = null;
  }

  if (isDraggingText) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // Check if the mouse is within the drawing area
    if (
      mouseX >= drawingArea.x &&
      mouseX <= drawingArea.x + drawingArea.width &&
      mouseY >= drawingArea.y &&
      mouseY <= drawingArea.y + drawingArea.height
    ) {
      placedTexts.push({
        img: draggedText.img,
        x: mouseX - translateX,
        y: mouseY,
      });
      if (!playedNote) { // Ensure a note is only generated once per interaction
        const note = randomNote();
        lastNoteText = note;
        console.log("played in mouseup for text: " + note);
        monPiano.sampler.triggerAttackRelease(note, "1n", "+0.1");
        console.log("Adding note to playedSounds for text: " + note);
        playedSounds.push(note); // Store the note in the array
        playedNote = true;
      }
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

function startPlayback() {
  let index = 0;

  function playNext() {
    if (index < playedSounds.length) {
      const note = playedSounds[index];
      monPiano.sampler.triggerAttackRelease(note, "1n", "+0.1");

      index++;
      setTimeout(playNext, 1000); // Adjust the duration to match the sound length
    } else {
      canvasMoving = true; // Resume normal animation after playback
      enableUserInteractions(); // Re-enable user interactions
    }
  }

  disableUserInteractions(); // Disable user interactions during playback
  playNext();
}

function disableUserInteractions() {
  canvas.removeEventListener("mousedown", handleMouseDown);
  canvas.removeEventListener("mousemove", handleMouseMove);
  canvas.removeEventListener("mouseup", handleMouseUp);
}

function enableUserInteractions() {
  canvas.addEventListener("mousedown", handleMouseDown);
  canvas.addEventListener("mousemove", handleMouseMove);
  canvas.addEventListener("mouseup", handleMouseUp);
}

function drawButton() {
  ctx.fillStyle = "red";
  ctx.fillRect(
    buttonPositions.right.x * canvas.width,
    buttonPositions.right.y * canvas.height,
    buttonPositions.right.width * canvas.width,
    buttonPositions.right.height * canvas.width
  );
}

function drawStopButton() {
  ctx.fillStyle = "blue";
  ctx.fillRect(
    buttonPositions.stop.x * canvas.width,
    buttonPositions.stop.y * canvas.height,
    buttonPositions.stop.width * canvas.width,
    buttonPositions.stop.height * canvas.height
  );
}

function drawLeftButton() {
  ctx.fillStyle = "green";
  ctx.fillRect(
    buttonPositions.left.x * canvas.width,
    buttonPositions.left.y * canvas.height,
    buttonPositions.left.width * canvas.width,
    buttonPositions.left.height * canvas.height
  );
}

function drawPlayButton() {

}

function drawLineButton() {
  // no fill button - add image
}

function drawIconButton() {
  ctx.fillStyle = "orange";
  ctx.fillRect(
    buttonPositions.iconButton.x * canvas.width,
    buttonPositions.iconButton.y * canvas.height,
    buttonPositions.iconButton.width * canvas.width,
    buttonPositions.iconButton.height * canvas.width
  );

  const iconRect = {
    x: buttonPositions.iconButton.x * canvas.width,
    y: buttonPositions.iconButton.y * canvas.height,
    width: buttonPositions.iconButton.width * canvas.width,
    height: buttonPositions.iconButton.height * canvas.height,
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
  ctx.fillStyle = "purple";
  ctx.fillRect(
    buttonPositions.textButton.x * canvas.width,
    buttonPositions.textButton.y * canvas.height,
    buttonPositions.textButton.width * canvas.width,
    buttonPositions.textButton.height * canvas.height
  );

  const textRect = {
    x: buttonPositions.textButton.x * canvas.width,
    y: buttonPositions.textButton.y * canvas.height,
    width: buttonPositions.textButton.width * canvas.width,
    height: buttonPositions.textButton.height * canvas.height,
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

function drawEraseButton() {
  ctx.fillStyle = "grey";
  ctx.fillRect(
    buttonPositions.EraseButton.x * canvas.width,
    buttonPositions.EraseButton.y * canvas.height,
    buttonPositions.EraseButton.width * canvas.width,
    buttonPositions.EraseButton.height * canvas.height
  );
}

function drawDrawingArea() {
  ctx.strokeStyle = "red";
  ctx.lineWidth = 4;
  ctx.strokeRect(
    drawingArea.x,
    drawingArea.y,
    drawingArea.width,
    drawingArea.height
  );
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

  drawButton();
  drawStopButton();
  drawLeftButton();
  drawPlayButton();
  drawDrawingArea();
  drawLineButton(); // Draw the line button
  drawIconButton();
  drawTextButton();
  drawEraseButton();

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