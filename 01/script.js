let myFont;
let ellipses = [];
let moving = false;
let direction = 1; // 1 for moving out, -1 for moving in

function preload() {
  myFont = loadFont("fonts/Helvetica-Bold.ttf");
}

function drawSquare(x, y, size, col) {
  fill(col);
  rect(x, y, size, size);
}

function drawEllipse(x, y, size, col) {
  fill(col);
  ellipse(x, y, size, size);
}

function setup() {
  const rectHeightFactor = 0.65;
  const rect1Height = 700 * rectHeightFactor;
  const squareSize = rect1Height / 2.2;
  const canvasWidth = 2 * squareSize + 45;

  createCanvas(canvasWidth, 700, P2D);
  noStroke();

  const startX = (width - 2 * squareSize) / 2;
  const startY = height - height * rectHeightFactor + (height * rectHeightFactor - 2 * squareSize) / 2;

  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 2; j++) {
      let baseX = startX + squareSize * i;
      let baseY = startY + squareSize * j;
      let offsets = [
        {x: squareSize * 0.5, y: squareSize * 0.5},
        {x: squareSize - 25, y: 25},
        {x: 25, y: squareSize - 25},
      ];
      
      for (let offset of offsets) {
        let x = baseX + offset.x;
        let y = baseY + offset.y;
        ellipses.push({
          x: x,
          y: y,
          tx: x + (i * 2 - 1) * squareSize,
          ty: y + (j * 2 - 1) * squareSize,
          size: squareSize / 2.5,
          col: color(35, 52, 134)
        });
      }
    }
  }
}

function draw() {
  background(35, 52, 134);

  const squareSize = (height * 0.65) / 2.2;
  const startX = (width - 2 * squareSize) / 2;
  const startY = height - height * 0.65 + (height * 0.65 - 2 * squareSize) / 2;

  drawSquare(startX, startY, squareSize, color(28, 28, 26));
  drawSquare(startX + squareSize, startY, squareSize, color(255, 238, 0));
  drawSquare(startX, startY + squareSize, squareSize, color(221, 7, 43));
  drawSquare(startX + squareSize, startY + squareSize, squareSize, color(255, 255, 255));

  // Move ellipses towards target //
  for (let e of ellipses) {
    if (moving) {
      e.x = lerp(e.x, e.tx, 0.02 * direction);
      e.y = lerp(e.y, e.ty, 0.02 * direction);
    }
    drawEllipse(e.x, e.y, e.size, e.col);
  }

  let allAtTarget = true;
  for (let e of ellipses) {
    if (dist(e.x, e.y, e.tx, e.ty) > 1) {
      allAtTarget = false;
      break;
    }
  }

  if (allAtTarget && moving) {
    moving = false;
  }

  textFont(myFont);
  textSize(25);
  fill(255);
  text("45\nMontreux\nJazz\nFestival\nJuly 1-16\n2011", startX, 33);
}

function mousePressed() {
  moving = true;
  direction = -direction; // toggle direction
}
