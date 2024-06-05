export default class Line {
  constructor(x1, y1, x2, y2, ctx, note = null, piano = null, lineFillImage, blendMode = 'difference') {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.ctx = ctx;
    this.note = note;
    this.piano = piano;
    this.strokeWidth = 40;
    this.lineFillImage = lineFillImage;
    this.blendMode = blendMode;
  }

  playNote() {
    if (this.piano && this.note) {
      console.log(`Playing note: ${this.note}`);
      this.piano.sampler.triggerAttackRelease(this.note, "1n");
    }
  }

  draw() {
    if (this.lineFillImage.complete) {
      const pattern = this.ctx.createPattern(this.lineFillImage, "repeat");
      this.ctx.strokeStyle = pattern;
    } else {
      this.ctx.strokeStyle = "black"; // Fallback color
    }
    this.ctx.globalCompositeOperation = this.blendMode;
    this.ctx.lineWidth = this.strokeWidth;
    this.ctx.beginPath();
    this.ctx.moveTo(this.x1, this.y1);
    this.ctx.lineTo(this.x2, this.y2);
    this.ctx.stroke();
    this.ctx.globalCompositeOperation = 'source-over'; 
  }

  
}
