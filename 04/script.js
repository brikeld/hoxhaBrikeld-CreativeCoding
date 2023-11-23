let myCharacter;
let trail = [];
let maxTrailLength = 50;
let easing = 0.03;
let staticShapes = [];

class Character {
  constructor(x, y, size) {
    this.position = createVector(x, y);
    this.velocity = createVector(0, 0);
    this.size = size;
    this.originalSize = size;
  }

  moveTo(x, y) {
    let target = createVector(x, y);
    this.velocity = p5.Vector.sub(target, this.position).mult(easing);
  }

  update() {
    this.position.add(this.velocity);

    this.checkBoundary();

    for (let shape of staticShapes) {
      if (shape.collidesWith(this)) {
        this.adjustVelocity(shape);
      }
    }

    this.updateSize();
    this.updateTrail();
  }

  checkBoundary() {
    if (
      this.position.x - this.size / 2 < 0 ||
      this.position.x + this.size / 2 > width
    ) {
      this.velocity.x *= -1;
    }
    if (
      this.position.y - this.size / 2 < 0 ||
      this.position.y + this.size / 2 > height
    ) {
      this.velocity.y *= -1;
    }
  }
  adjustVelocity(shape) {
    if (this.position.x > shape.x && this.position.x < shape.x + shape.w) {
      this.velocity.y *= -1;
    } else {
      this.velocity.x *= -1;
    }
  }

  updateSize() {
    this.size = lerp(this.size, this.originalSize, 0.1);
  }

  updateTrail() { // ajoute la position actuelle dans un array e efface les anciennes pour limiter la longueur du trail
    trail.push(this.position.copy());
    if (trail.length > maxTrailLength) {
      trail.shift();
    }
  }

  display() {
    this.displayTrail();

    fill(255, 0, 0);
    ellipse(this.position.x, this.position.y, this.size, this.size);
    fill(255);
    let ayeSize = this.size / 8;
    let ayeOffset = this.size / 8;
    ellipse(this.position.x-5 - ayeOffset, this.position.y-5, ayeSize, ayeSize);
    ellipse(this.position.x-5 + ayeOffset, this.position.y-5, ayeSize, ayeSize);
    fill(0);
    let mouthWidth = this.size / 4;
    let mouthHeight = this.size / 8;
    let mouthOffset = this.size / 4;
    arc(this.position.x-5, this.position.y+5, mouthWidth, mouthHeight, 0, PI, CHORD);
  }

  displayTrail() { // dessine le trail du personnage avec opacité et taille qui diminue dans le temps 
    for (let i = trail.length - 1; i >= 0; i--) { 
      let pos = trail[i]; 
      let alpha = map(i, 0, trail.length, 0, 255);
      fill(255, 0, 0, alpha);
      noStroke();
      ellipse(
        pos.x,
        pos.y,
        this.size * (1 - i / trail.length),
        this.size * (1 - i / trail.length)
      );
    }
  }
}

class Shape {
  constructor(x, y, w, h, color) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.color = color;
  }

  collidesWith(character) {
    let halfSize = character.size / 2;
    return (
      character.position.x + halfSize > this.x &&
      character.position.x - halfSize < this.x + this.w &&
      character.position.y + halfSize > this.y &&
      character.position.y - halfSize < this.y + this.h
    );
  }

  display() {
    fill(this.color);
    rect(this.x, this.y, this.w, this.h);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  myCharacter = new Character(width / 2, height / 2, 50);

  staticShapes.push(new Shape(1100, 1100, 200, 90, color(255)));
  staticShapes.push(new Shape(1400, 350, 300, 300, color(255)));
  staticShapes.push(new Shape(1590, 790, 100, 30, color(255)));
  staticShapes.push(new Shape(450, 400, 120, 55, color(255)));
  staticShapes.push(new Shape(250, 150, 80, 40, color(255)));
}

function draw() {
  background(22);

  for (let shape of staticShapes) {
    shape.display();
  }

  myCharacter.update();
  myCharacter.display();
}

function mousePressed() {
  myCharacter.moveTo(mouseX, mouseY);
}
