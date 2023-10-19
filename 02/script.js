const NUM_LINES = 200;
let t = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
}

function draw()   {
  background(20,20,20);
  strokeWeight(1);

  
  translate(width /2 , height / 2);
  
  for (let i = 0; i < NUM_LINES; i++) {
    let offset = TWO_PI / NUM_LINES * i;
    
    let c1 = color(188, 10, 120); 
    let c2 = color(68, 120, 230); 
    let gradientColor = lerpColor(c1, c2, float(i) / NUM_LINES);
    
    stroke(gradientColor);
    
   
    let separation =350; 
    
    line(x1(t+offset) + separation, y1(t+offset), x2(t+offset) + separation, y2(t+offset));
    line(-x1(t+offset) - separation, -y1(t+offset), -x2(t+offset) - separation, -y2(t+offset));
    
    stroke(gradientColor, 50);
    line(x1(t+offset) + separation, y1(t+offset), -x1(t+offset) - separation, -y1(t+offset));
  }
  
  t += 0.15;
}

function x1(t) {
  return sin(t / 410) * 100 + sin(t) * 120;
}

function y1(t) {
  return cos(t / 130) * 75 + sin(t / 4) * 100; 
}

function x2(t) {
  return sin(t / 30) * 130 + sin(t / 3) * 190;
}

function y2(t) {
  return cos(t / 50) * 200 + sin(t / 3) * 80;
}