export default class DottedLine {
  constructor(x1, y1, x2, y2, ctx, note = null, piano = null, dottedLineFillImage, blendMode = 'difference') {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.ctx = ctx;
    this.note = note;
    this.piano = piano;
    this.circleRadius = 20;
    this.circleSpacing = 20;
    this.dottedLineFillImage = dottedLineFillImage;
    this.blendMode = blendMode;
  }

  playNote() {
    if (this.piano && this.note) {
      console.log(`Playing note: ${this.note}`);
      this.piano.sampler.triggerAttackRelease(this.note, "1n", "+0.1");
    }
  }

  draw() {
    const dx = this.x2 - this.x1;
    const dy = this.y2 - this.y1;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const steps = Math.floor(distance / this.circleSpacing);
    const xStep = dx / steps;
    const yStep = dy / steps;

    if (this.dottedLineFillImage.complete) {
      const pattern = this.ctx.createPattern(this.dottedLineFillImage, "repeat");
      this.ctx.fillStyle = pattern;
    } else {
      this.ctx.fillStyle = "black"; // Fallback color
    }

    this.ctx.globalCompositeOperation = this.blendMode;

    for (let i = 0; i <= steps; i++) {
      const x = this.x1 + i * xStep;
      const y = this.y1 + i * yStep;
      this.ctx.beginPath();
      this.ctx.arc(x, y, this.circleRadius, 0, 2 * Math.PI);
      this.ctx.fill();
    }

    this.ctx.globalCompositeOperation = 'source-over'; 
  }
}
