const { PNG } = require('pngjs');
const fs = require('fs');

const W = 1024;
const H = 500;
const png = new PNG({ width: W, height: H });

// Colors
const bg = [10, 10, 15];
const purple = [108, 99, 255];
const purpleLight = [139, 133, 255];
const white = [255, 255, 255];

function setPixel(x, y, r, g, b, a = 255) {
  x = Math.round(x);
  y = Math.round(y);
  if (x < 0 || x >= W || y < 0 || y >= H) return;
  const idx = (W * y + x) * 4;
  png.data[idx] = r;
  png.data[idx + 1] = g;
  png.data[idx + 2] = b;
  png.data[idx + 3] = a;
}

function fillRect(x1, y1, w, h, r, g, b) {
  for (let y = y1; y < y1 + h; y++)
    for (let x = x1; x < x1 + w; x++)
      setPixel(x, y, r, g, b);
}

function fillCircle(cx, cy, radius, r, g, b) {
  for (let y = cy - radius; y <= cy + radius; y++)
    for (let x = cx - radius; x <= cx + radius; x++)
      if ((x - cx) ** 2 + (y - cy) ** 2 <= radius ** 2)
        setPixel(x, y, r, g, b);
}

function drawChar(ch, sx, sy, scale, r, g, b) {
  const chars = {
    'F': [[0,0,4,1],[0,0,1,7],[0,3,3,1]],
    'i': [[1,0,1,1],[1,2,1,5]],
    't': [[0,0,3,1],[1,0,1,7],[0,6,3,1]],
    'C': [[1,0,3,1],[0,1,1,5],[1,6,3,1]],
    'o': [[1,0,2,1],[0,1,1,5],[3,1,1,5],[1,6,2,1]],
    'r': [[0,0,1,7],[1,0,3,1],[4,1,1,2]],
    'e': [[1,0,2,1],[0,1,1,5],[1,3,3,1],[1,6,3,1],[3,1,1,2]],
  };
  const pattern = chars[ch];
  if (!pattern) return;
  for (const [bx, by, bw, bh] of pattern) {
    fillRect(sx + bx * scale, sy + by * scale, bw * scale, bh * scale, r, g, b);
  }
}

// Fill background
fillRect(0, 0, W, H, ...bg);

// Decorative gradient bar at top
for (let x = 0; x < W; x++) {
  const t = x / W;
  const r = Math.round(purple[0] * (1 - t) + purpleLight[0] * t);
  const g = Math.round(purple[1] * (1 - t) + purpleLight[1] * t);
  const b = Math.round(purple[2] * (1 - t) + purpleLight[2] * t);
  for (let y = 0; y < 4; y++) setPixel(x, y, r, g, b);
  for (let y = H - 4; y < H; y++) setPixel(x, y, r, g, b);
}

// Dumbbell icon (left side)
const iconCX = 200;
const iconCY = 250;
// Bar
fillRect(iconCX - 80, iconCY - 6, 160, 12, ...purple);
// Left plates
fillRect(iconCX - 90, iconCY - 35, 20, 70, ...purpleLight);
fillRect(iconCX - 100, iconCY - 25, 15, 50, ...purple);
// Right plates
fillRect(iconCX + 70, iconCY - 35, 20, 70, ...purpleLight);
fillRect(iconCX + 85, iconCY - 25, 15, 50, ...purple);

// App name "FitCore" on right side - large
const textStartX = 380;
const textY = 170;
const s = 10;

// F
fillRect(textStartX, textY, s * 1, s * 7, ...white);
fillRect(textStartX, textY, s * 4, s * 1, ...white);
fillRect(textStartX, textY + s * 3, s * 3, s * 1, ...white);

// i
fillRect(textStartX + s * 5.5, textY, s * 1, s * 1, ...white);
fillRect(textStartX + s * 5.5, textY + s * 2, s * 1, s * 5, ...white);

// t
fillRect(textStartX + s * 8, textY, s * 3, s * 1, ...white);
fillRect(textStartX + s * 9, textY, s * 1, s * 7, ...white);
fillRect(textStartX + s * 8, textY + s * 6, s * 3, s * 1, ...white);

// C
fillRect(textStartX + s * 13, textY, s * 3, s * 1, ...purple);
fillRect(textStartX + s * 12, textY + s * 1, s * 1, s * 5, ...purple);
fillRect(textStartX + s * 13, textY + s * 6, s * 3, s * 1, ...purple);

// o
fillRect(textStartX + s * 17, textY, s * 2, s * 1, ...purple);
fillRect(textStartX + s * 16, textY + s * 1, s * 1, s * 5, ...purple);
fillRect(textStartX + s * 19, textY + s * 1, s * 1, s * 5, ...purple);
fillRect(textStartX + s * 17, textY + s * 6, s * 2, s * 1, ...purple);

// r
fillRect(textStartX + s * 21, textY, s * 1, s * 7, ...purple);
fillRect(textStartX + s * 22, textY, s * 3, s * 1, ...purple);
fillRect(textStartX + s * 25, textY + s * 1, s * 1, s * 2, ...purple);

// e
fillRect(textStartX + s * 27.5, textY, s * 2.5, s * 1, ...purple);
fillRect(textStartX + s * 27, textY + s * 1, s * 1, s * 5, ...purple);
fillRect(textStartX + s * 27.5, textY + s * 3, s * 3, s * 1, ...purple);
fillRect(textStartX + s * 27.5, textY + s * 6, s * 3, s * 1, ...purple);
fillRect(textStartX + s * 30, textY + s * 1, s * 1, s * 2, ...purple);

// Tagline "100% Offline Fitness"
const tagY = textY + s * 9;
const tagTexts = [
  { text: '100% Offline', color: purpleLight },
  { text: ' Fitness Tracker', color: [136, 136, 170] },
];
// Simple dots for tagline
for (let i = 0; i < 22; i++) {
  const x = textStartX + i * 14;
  fillCircle(x, tagY + 5, 2, ...purpleLight);
}

// Step counter visualization (bottom left)
const ringCX = 200;
const ringCY = 420;
for (let angle = 0; angle < Math.PI * 1.5; angle += 0.02) {
  const x = ringCX + Math.cos(angle - Math.PI / 2) * 30;
  const y = ringCY + Math.sin(angle - Math.PI / 2) * 30;
  fillCircle(Math.round(x), Math.round(y), 2, ...purple);
}

// Chart bars (bottom right area)
const barStart = 700;
const barY = 400;
const heights = [30, 45, 35, 60, 50, 70, 55];
for (let i = 0; i < 7; i++) {
  const h = heights[i];
  fillRect(barStart + i * 30, barY - h, 18, h, ...purple);
}

// Write file
const buffer = PNG.sync.write(png);
fs.writeFileSync('./store/feature-graphic.png', buffer);
console.log('Feature graphic generated: store/feature-graphic.png');
