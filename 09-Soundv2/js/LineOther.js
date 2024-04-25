export default class LineOther {
  constructor(x1, y1, x2, y2, color, ctx, note = null, piano = null) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.color = color;
    this.ctx = ctx;
    this.note = note;
    this.piano = piano;
    this.strokeWidth = 40;
    
    this.playNote();
  }

  playNote() {
    if (this.piano && this.note) {
      this.piano.sampler.triggerAttack(this.note);
    }
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.moveTo(this.x1, this.y1);
    this.ctx.lineTo(this.x2, this.y2);
    this.ctx.strokeStyle = this.color;
    this.ctx.lineWidth = this.strokeWidth;
    this.ctx.stroke();
  }
}