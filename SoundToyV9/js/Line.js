export default class Line {
  constructor(x1, y1, x2, y2, color, ctx, note = null, piano = null) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.color = "black"; // color || "black
    this.ctx = ctx;
    this.note = note;
    this.piano = piano;
    this.strokeWidth = 40;
  }

  playNote() {
    if (this.piano && this.note) {
      console.log(`Playing note: ${this.note}`);
      this.piano.sampler.triggerAttackRelease(this.note, "1n");
    }
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.moveTo(this.x1, this.y1);
    this.ctx.lineTo(this.x2, this.y2);
    this.ctx.strokeStyle = this.color;
    this.ctx.lineWidth = this.strokeWidth;
    this.ctx.stroke();
    this.ctx.globalCompositeOperation = 'source-over';
  }
}