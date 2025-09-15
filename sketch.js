// --- Globals ---
let fishes = [];
let bubbles = [];
let seaweed = [];

// === COPY YOUR FUNCTIONS HERE (slightly adapted) ===

// Draw seaweed
function drawSeaweed(x, y, h) {
  noStroke();
  fill(0, 150, 50);
  // gentle sway for mobile-friendly motion (slow)
  const sway = 8 * sin(frameCount * 0.01 + x * 0.02);
  bezier(x, y, x-10+sway, y-h/3, x+10-sway, y-(2*h/3), x, y-h);
  ellipse(x, y-h, 20, 40);
}

// Draw one fish
function drawfish(x, y, length_, height_, bodyColor) {
  noStroke();
  fill(bodyColor);
  ellipse(x, y, length_, height_); // body

  const tailWidth = length_ / 4;
  const tailHeight = height_ / 2;
  triangle(x - length_/2, y,
           x - length_/2 - tailWidth, y - tailHeight,
           x - length_/2 - tailWidth, y + tailHeight);

  fill(33);
  ellipse(x + length_/4, y, height_/5, height_/5); // eye
}

// Draw one bubble
function drawBubble(x, y, size) {
  noStroke();
  fill(255, 255, 255, 150);
  ellipse(x, y, size, size);
}

// === SETUP & RESPONSIVE RESIZE ===
function setup() {
  // Responsive canvas: fits phone screens nicely
  const w = Math.min(window.innerWidth, 600);
  const h = Math.min(window.innerHeight * 0.8, 500);
  const c = createCanvas(w, h);
  c.parent('canvas-holder');
  pixelDensity(1);        // lighter on phones
  frameRate(60);          // smooth but not excessive

  initScene();
}

function windowResized() {
  const w = Math.min(window.innerWidth, 600);
  const h = Math.min(window.innerHeight * 0.8, 500);
  resizeCanvas(w, h);
  // Rebuild seaweed to match new width/height
  buildSeaweed();
}

// Build initial data
function initScene() {
  // Fish (copy your fish array here; use color() from p5)
  fishes = [
    {x:50,  y:100, length:80,  height:40, color: color(0,180,255), speed:2},
    {x:200, y:150, length:100, height:60, color: color(255,120,0), speed:1},
    {x:300, y:250, length:60,  height:30, color: color(120,0,255), speed:3},
    {x:100, y:300, length:120, height:70, color: color(0,200,110), speed:2}
  ];

  // Bubbles
  bubbles = [
    {x: 50,  y: height-20, size: 15, speed: 1},
    {x: 120, y: height-40, size: 10, speed: 2},
    {x: 200, y: height-10, size: 20, speed: 1.5},
    {x: 300, y: height-30, size: 12, speed: 1}
  ];

  // Seaweed
  buildSeaweed();
}

function buildSeaweed() {
  seaweed = [];
  for (let i = 0; i < width; i += 60) {
    seaweed.push({ x: i + 20, h: random(80, 150) });
  }
}

// === DRAW LOOP ===
function draw() {
  background(89, 216, 255);

  // Seaweed (back layer)
  for (let s of seaweed) {
    drawSeaweed(s.x, height, s.h);
  }

  // Bubbles (middle)
  for (let b of bubbles) {
    b.y -= b.speed;
    if (b.y < -b.size) {
      b.y = height + b.size;
      b.x = random(width);
    }
    drawBubble(b.x, b.y, b.size);
  }

  // Fish (front)
  for (let f of fishes) {
    if (f.baseY === undefined) f.baseY = f.y;
    if (f.wiggleOffset === undefined) f.wiggleOffset = random(0, TWO_PI);

    f.x += f.speed;
    if (f.x > width + f.length/2) f.x = -f.length/2;

    f.wiggleOffset += 0.05;
    const wiggleAmount = 5 * sin(f.wiggleOffset);
    const newY = f.baseY + wiggleAmount;

    drawfish(f.x, newY, f.length, f.height, f.color);
  }
}

// Optional: tap to add bubbles on phones
function touchStarted() {
  bubbles.push({ x: mouseX, y: mouseY, size: random(10, 20), speed: random(1, 2) });
  return false; // prevent scroll on mobile
}
