class App {
  constructor() {
    this.setup();
    this.rotationAngle = 0;
  }

  setup() {
    this.createCanvas();
    this.audioTool = new AudioTool("audio/Within.mp3");
    this.allCircles = this.createCircles();

    document.addEventListener("click", () => {
      this.audioTool.togglePlay();
    });

    this.draw();
   

    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  createPointGrid() {
    const points = [];
    const gridSize = 20;
        for (let x = 0; x < this.width; x += gridSize) {
      for (let y = 0; y < this.height; y += gridSize) {
        points.push({ x, y, originalX: x, originalY: y });
      }
    }
    return points;
  }

  createCanvas() {
    this.height = window.innerHeight;
    this.width = window.innerWidth;
    this.canvas = document.createElement("canvas");
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.ctx = this.canvas.getContext("2d");
    document.body.appendChild(this.canvas);
  }

  createCircles() {
    const circles = [];
    for (let i = 0; i < this.audioTool.bufferLength; i++) {
      const color = this.mapFrequencyToColor(0); // Initial color
      circles.push(new Circle(i * 2, this.height / 2, 5, this.ctx, color));
    }
    return circles;
  }

  mapFrequencyToColor(frequency) {
    this.ctx.fillStyle = "black";
    const hue = (frequency * 2) % 180; // Mapping frequency to hue
    return `hsl(${hue}, 30%, 50%)`;

  }

  draw() {
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.width, this.height);


    
    const currentTime = Date.now();
    this.audioTool.updateFrequency();
    const data = this.audioTool.dataFrequency;

    this.rotationAngle += 1; 

    data.forEach((value, index) => {
      if (this.allCircles[index]) {
        const timeFactor = currentTime * 0.0002; // Control the speed of the animation
        const angle = (timeFactor + index * 0.1) % (Math.PI * 2);
        const radius = value * 2; // Radius based on frequency value
        const randomFactor = Math.random() * 0.5 + 0.5; // Random factor between 0.5 and 1

        // Animated movement
        this.allCircles[index].x = this.width / 2 + Math.cos(angle) * radius * randomFactor;
        this.allCircles[index].y = this.height / 2 + Math.sin(angle) * radius * randomFactor;

        this.allCircles[index].color = this.mapFrequencyToColor(value);
        this.allCircles[index].draw();

      }
    }
    );
    window.requestAnimationFrame(this.draw.bind(this));
  }
}
window.onload = () => {
  new App();
}
