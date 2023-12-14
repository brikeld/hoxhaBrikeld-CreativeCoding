class Text {
  constructor(x, y, ctx, color = 'white') {
    this.x = x;
    this.y = y;
    this.ctx = ctx;
    this.color = color; // Added color attribute
    this.fontSize = 15;
    this.letters = "abcdefghijklmnopqrstuvwxyz0123456789";
    this.letter = this.letters[Math.floor(Math.random() * this.letters.length)];
  }

  draw() {
    this.ctx.font = `${this.fontSize}px Arial`;
    this.ctx.fillStyle = this.color; // Use the color attribute
    this.ctx.fillText(`${this.letter}`, this.x, this.y);
  }
}