class Circle {
  constructor(x, y, radius, ctx, color = 'white') {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.ctx = ctx;
    this.color = color; // Added color attribute
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
    this.ctx.fillStyle = this.color; // Use the color attribute
    this.ctx.fill();
    this.ctx.closePath();
  }
}