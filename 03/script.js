let tileSize;
let numTiles = 8;
let tilesMap = new Map();

function setup() {
  createCanvas(windowWidth, windowHeight) ;
  tileSize = width / numTiles;
  for (let y = 0; y < numTiles; y++) {
    for (let x = 0; x < numTiles; x++) {
      let key = `${x}-${y}`;
      tilesMap.set(key, new Tile(x * tileSize, y * tileSize, tileSize, floor(random(4))));
    }
  }
}
function draw() {
  background(240);
  for (let [key, tile] of tilesMap) {
    tile.draw();
  }
}

function mousePressed() {
  let col = floor(mouseX / tileSize);
  let row = floor(mouseY / tileSize);
  if (col >= 0 && col < numTiles && row >= 0 && row < numTiles) {
    let key = `${col}-${row}`;
    let tile = tilesMap.get(key);
    tile.setState((tile.state + 1) % 4);
  }
}

class Tile {
  constructor(x, y, size, state) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.state = state;
  }

  setState(newState) {
    this.state = newState;
  }

  draw() {
    push();
    translate(this.x, this.y);
    let colors = ['red', 'blue', 'green', 'purple'];// 4 configuarazioni 4 colori
    stroke(colors[this.state]);
    strokeWeight(2);
    noFill();

    switch (this.state) {
      case 0:

        arc(0, 0, this.size * 2, this.size * 2, 0, HALF_PI);
        arc(this.size, this.size, this.size * 2, this.size * 2, PI, PI + HALF_PI);
        break;
      case 1:

        arc(this.size, 0, this.size * 2, this.size * 2, HALF_PI, PI);
        arc(0, this.size, this.size * 2, this.size * 2, PI + HALF_PI, TWO_PI);
        break;
      case 2:
     
        arc(0, 0, this.size * 2, this.size * 2, 0, HALF_PI);
        arc(0, this.size, this.size * 2, this.size * 2, PI + HALF_PI, TWO_PI);
        break;
       case 3:
     
        arc(this.size, 0, this.size * 2, this.size * 2, HALF_PI, PI);
        arc(this.size, this.size, this.size * 2, this.size * 2, PI, PI + HALF_PI);
          break;
    }
    
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  tileSize = width / numTiles;
  tilesMap.forEach((tile, key) => {
    let [x, y] = key.split('-').map(Number);
    tile.x = x * tileSize;
    tile.y = y * tileSize;
    tile.size = tileSize;
});
}
