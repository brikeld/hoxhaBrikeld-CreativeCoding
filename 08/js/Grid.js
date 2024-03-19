export default class Grid {
  constructor(ctx) {
    console.log("Grid");
    this.NUM_LINES = 70;
    this.ctx = ctx;
    this.t = 0;

    this.lineSound = new Audio('audio/Within.mp3');
    this.handTogetherSound = new Audio('audio/Within.mp3'); 
  }

  draw(fingers, t) {
    this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    let handsDetected = fingers.length >= 2 && fingers[0].x !== null && fingers[1].x !== null;

    if (handsDetected) {
      this.drawLinesBetweenFingers(fingers, t);

      const distance = this.calculateDistance(fingers[0], fingers[1]);
      this.adjustPlaybackSpeed(distance);

      if (distance < 1) { 
        if (this.handTogetherSound.paused) {
          this.handTogetherSound.play();
        }
      } else {
        this.handTogetherSound.pause();
        this.handTogetherSound.currentTime = 0;
      }
    } else {
      this.lineSound.pause();
      this.lineSound.currentTime = 0;
      this.handTogetherSound.pause();
      this.handTogetherSound.currentTime = 0;
    }

    const largeur = window.innerWidth / 4;
    const hauteur = window.innerHeight / 4;
    this.ctx.strokeStyle = "rgba(0, 0, 0, 0)";
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        this.ctx.beginPath();
        this.ctx.rect(x * largeur, y * hauteur, largeur, hauteur);
        this.ctx.stroke();
        this.ctx.closePath();
      }
    }

    fingers.forEach(finger => {
      if (finger.x !== null && finger.y !== null) {
        const fingerX = Math.floor((finger.x * window.innerWidth) / largeur);
        const fingerY = Math.floor((finger.y * window.innerHeight) / hauteur);
        this.ctx.fillStyle = "rgba(0, 0, 0, 0)";
        this.ctx.fillRect(fingerX * largeur, fingerY * hauteur, largeur, hauteur);
      }
    });
  }

  drawLinesBetweenFingers(fingers, t) {
    let x1 = fingers[0].x * window.innerWidth;
    let y1 = fingers[0].y * window.innerHeight;
    let x2 = fingers[1].x * window.innerWidth;
    let y2 = fingers[1].y * window.innerHeight;
  
    let canvasWidth = window.innerWidth;
    this.lineSound.play();
  
    for (let i = 0; i < this.NUM_LINES; i++) {
      let fraction = i / (this.NUM_LINES - 1);
      let color = this.lerpColor({r: 255, g: 0, b: 0}, {r: 128, g: 0, b: 128}, fraction);
      let interX = x1 + (x2 - x1) * fraction;
      let interY = y1 + (y2 - y1) * fraction;
  
      let waveAmplitude = 100+i/5;
      let waveFrequency = 1+ i / 5; 
      let wave = waveAmplitude * Math.sin(t * waveFrequency + fraction * Math.PI * 2);
  
      this.ctx.beginPath();
      this.ctx.moveTo(x1 + wave, y1 + i * 5); 
      this.ctx.lineTo(interX + wave, interY + i * 5);
      this.ctx.strokeStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
      this.ctx.lineWidth = 3;
      this.ctx.stroke();
  
      let mirroredX1 = canvasWidth - (x1 + wave);
      let mirroredInterX = canvasWidth - (interX + wave);
  
      this.ctx.beginPath();
      this.ctx.moveTo(mirroredX1, y1 + i * 5);
      this.ctx.lineTo(mirroredInterX, interY + i * 5);
      this.ctx.stroke();
    }
  }

  adjustPlaybackSpeed(distance) {
    const minSpeed = -0.5;
    const maxSpeed = 10;
    const normalizedDistance = Math.min(distance / 200, 1);   //200max1min
    const speed = minSpeed + (1 - normalizedDistance) * (maxSpeed - minSpeed);
    this.lineSound.playbackRate = speed;
    console.log(speed);
  }

  lerpColor(a, b, amount) { 
    var result = { r: 0, g: 0, b: 0 };
    result.r = a.r + amount * (b.r - a.r); 
    result.g = a.g + amount * (b.g - a.g);  
    result.b = a.b + amount * (b.b - a.b);
    return result;
  }

  calculateDistance(point1, point2) {
    const dx = point1.x - point2.x;
    const dy = point1.y - point2.y; // dis entr 2
    return Math.sqrt(dx * dx + dy * dy);
  }
}
