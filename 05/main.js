
function createSketch(img, xStart, yStart, imgWidth, imgHeight) {
  return function (p) {
    let maxDiameter, revealSpeed = 0.5, revealProgress = 0;
    let shapes = ['ellipse', 'rect'];
    let currentShape, colorFilter;
    let tileSize, numTiles;

    p.preload = function() {
     
      img = p.loadImage('000026.jpeg', img => {
        img = img.get(xStart, yStart, imgWidth, imgHeight);
      });
    };

    p.setup = function() {
      p.createCanvas(300, 300);
      setRandomParameters();
    };

    p.draw = function() {
      p.background(0);
      p.noStroke();

      for (let x = 0; x < numTiles; x++) {
        for (let y = 0; y < numTiles; y++) {
          let imgX = p.floor(p.map(x, 0, numTiles, 0, img.width));
          let imgY = p.floor(p.map(y, 0, numTiles, 0, img.height));
          let c = img.get(imgX, imgY);
          c = applyColorFilter(c, colorFilter);
          let b = p.brightness(c);
          let diameter = p.map(b, 0, 255, 0, tileSize);
          diameter = p.min(diameter, revealProgress);

          p.fill(c);
          drawShape(x * tileSize + tileSize / 2, y * tileSize + tileSize / 2, diameter);
        }
      }

      revealProgress += revealSpeed;
      if (revealProgress > tileSize) {
        revealProgress = 0;
        setRandomParameters();
      }
    };

    function drawShape(x, y, diameter) {
      if (currentShape === 'ellipse') {
        p.ellipse(x, y, diameter, diameter);
      } else if (currentShape === 'rect') {
        p.rectMode(p.CENTER);
        p.rect(x, y, diameter, diameter);
      }
    }

    function randomColorFilter() {
      return p.color(p.random(255), p.random(255), p.random(255));
    }

    function applyColorFilter(col, filter) {
      return p.color(
        (p.red(col) + p.red(filter)) / 2,
        (p.green(col) + p.green(filter)) / 2,
        (p.blue(col) + p.blue(filter)) / 2
      );
    }

    function setRandomParameters() {
      currentShape = p.random(shapes);
      colorFilter = randomColorFilter();
      numTiles = p.floor(p.random(20, 50)); // RANDOM TILESSS
      tileSize = p.width / numTiles;
    }
  };
}


const imgWidth = 305; 
const imgHeight = 305; 
const totalWidth = 1000; 
const totalHeight = 1000; 

// Create sketches
for (let x = 0; x < totalWidth; x += imgWidth) {
  for (let y = 0; y < totalHeight; y += imgHeight) {
    let div = document.createElement('div');
    div.style.display = 'inline-block'; 
    div.style.margin = '5px';
    div.style.width = `${imgWidth}px`;
    div.style.height = `${imgHeight}px`;
    document.body.appendChild(div);
    new p5(createSketch(null, x, y, imgWidth, imgHeight), div);
  }
}
