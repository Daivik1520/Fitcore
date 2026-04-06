const { PNG } = require("pngjs");
const fs = require("fs");
const path = require("path");

const ASSETS_DIR = path.join(__dirname, "assets");

// Colors
const BG = { r: 10, g: 10, b: 15, a: 255 }; // #0A0A0F
const PURPLE = { r: 108, g: 99, b: 255, a: 255 }; // #6C63FF
const WHITE = { r: 255, g: 255, b: 255, a: 255 };
const TRANSPARENT = { r: 0, g: 0, b: 0, a: 0 };

function createPNG(width, height) {
  const png = new PNG({ width, height });
  return png;
}

function setPixel(png, x, y, color) {
  if (x < 0 || x >= png.width || y < 0 || y >= png.height) return;
  const idx = (png.width * y + x) << 2;
  png.data[idx] = color.r;
  png.data[idx + 1] = color.g;
  png.data[idx + 2] = color.b;
  png.data[idx + 3] = color.a;
}

function fill(png, color) {
  for (let y = 0; y < png.height; y++) {
    for (let x = 0; x < png.width; x++) {
      setPixel(png, x, y, color);
    }
  }
}

function fillRect(png, rx, ry, rw, rh, color) {
  for (let y = ry; y < ry + rh; y++) {
    for (let x = rx; x < rx + rw; x++) {
      setPixel(png, x, y, color);
    }
  }
}

function fillCircle(png, cx, cy, radius, color) {
  const r2 = radius * radius;
  for (let y = cy - radius; y <= cy + radius; y++) {
    for (let x = cx - radius; x <= cx + radius; x++) {
      const dx = x - cx;
      const dy = y - cy;
      if (dx * dx + dy * dy <= r2) {
        setPixel(png, Math.round(x), Math.round(y), color);
      }
    }
  }
}

function fillRoundedRect(png, rx, ry, rw, rh, radius, color) {
  // Fill center
  fillRect(png, rx + radius, ry, rw - 2 * radius, rh, color);
  // Fill left/right strips
  fillRect(png, rx, ry + radius, radius, rh - 2 * radius, color);
  fillRect(png, rx + rw - radius, ry + radius, radius, rh - 2 * radius, color);
  // Fill corners
  fillQuarterCircle(png, rx + radius, ry + radius, radius, color, "tl");
  fillQuarterCircle(png, rx + rw - radius - 1, ry + radius, radius, color, "tr");
  fillQuarterCircle(png, rx + radius, ry + rh - radius - 1, radius, color, "bl");
  fillQuarterCircle(png, rx + rw - radius - 1, ry + rh - radius - 1, radius, color, "br");
}

function fillQuarterCircle(png, cx, cy, radius, color, corner) {
  const r2 = radius * radius;
  for (let dy = 0; dy <= radius; dy++) {
    for (let dx = 0; dx <= radius; dx++) {
      if (dx * dx + dy * dy <= r2) {
        let px, py;
        if (corner === "tl") { px = cx - dx; py = cy - dy; }
        else if (corner === "tr") { px = cx + dx; py = cy - dy; }
        else if (corner === "bl") { px = cx - dx; py = cy + dy; }
        else { px = cx + dx; py = cy + dy; }
        setPixel(png, px, py, color);
      }
    }
  }
}

// Bitmap font for "F" and "C" - each letter is defined on a grid
// We'll draw them as thick geometric shapes

function drawLetterF(png, x, y, w, h, color) {
  const thick = Math.round(w * 0.22);
  // Vertical bar
  fillRect(png, x, y, thick, h, color);
  // Top horizontal bar
  fillRect(png, x, y, w, thick, color);
  // Middle horizontal bar
  const midY = y + Math.round(h * 0.42);
  fillRect(png, x, midY, Math.round(w * 0.75), thick, color);
}

function drawLetterC(png, x, y, w, h, color) {
  const thick = Math.round(w * 0.22);
  // Vertical bar (left side)
  fillRect(png, x, y + thick, thick, h - 2 * thick, color);
  // Top horizontal bar
  fillRect(png, x + thick, y, w - thick, thick, color);
  // Bottom horizontal bar
  fillRect(png, x + thick, y + h - thick, w - thick, thick, color);
  // Round corners using quarter circles
  fillQuarterCircle(png, x + thick, y + thick, thick, color, "tl");
  fillQuarterCircle(png, x + thick, y + h - thick - 1, thick, color, "bl");
}

function drawBarbell(png, cx, cy, size, color) {
  // size is the total width of the barbell
  const barWidth = Math.round(size * 0.65);
  const barHeight = Math.round(size * 0.06);
  const plateWidth = Math.round(size * 0.10);
  const plateHeight = Math.round(size * 0.35);
  const outerPlateWidth = Math.round(size * 0.07);
  const outerPlateHeight = Math.round(size * 0.25);

  // Central bar
  const barY = cy - Math.round(barHeight / 2);
  const barX = cx - Math.round(barWidth / 2);
  fillRoundedRect(png, barX, barY, barWidth, barHeight, Math.round(barHeight / 3), color);

  // Inner plates (larger)
  const innerPlateOffset = Math.round(barWidth * 0.38);
  // Left inner plate
  fillRoundedRect(
    png,
    cx - innerPlateOffset - plateWidth,
    cy - Math.round(plateHeight / 2),
    plateWidth,
    plateHeight,
    Math.round(plateWidth * 0.25),
    color
  );
  // Right inner plate
  fillRoundedRect(
    png,
    cx + innerPlateOffset,
    cy - Math.round(plateHeight / 2),
    plateWidth,
    plateHeight,
    Math.round(plateWidth * 0.25),
    color
  );

  // Outer plates (smaller)
  const outerPlateOffset = Math.round(barWidth * 0.48);
  // Left outer plate
  fillRoundedRect(
    png,
    cx - outerPlateOffset - outerPlateWidth,
    cy - Math.round(outerPlateHeight / 2),
    outerPlateWidth,
    outerPlateHeight,
    Math.round(outerPlateWidth * 0.25),
    color
  );
  // Right outer plate
  fillRoundedRect(
    png,
    cx + outerPlateOffset,
    cy - Math.round(outerPlateHeight / 2),
    outerPlateWidth,
    outerPlateHeight,
    Math.round(outerPlateWidth * 0.25),
    color
  );
}

function drawFC(png, cx, cy, letterHeight, color) {
  const letterWidth = Math.round(letterHeight * 0.6);
  const gap = Math.round(letterHeight * 0.15);
  const totalWidth = letterWidth * 2 + gap;
  const startX = cx - Math.round(totalWidth / 2);
  const startY = cy - Math.round(letterHeight / 2);

  drawLetterF(png, startX, startY, letterWidth, letterHeight, color);
  drawLetterC(png, startX + letterWidth + gap, startY, letterWidth, letterHeight, color);
}

function applyRoundedCornerMask(png, radius) {
  const w = png.width;
  const h = png.height;
  const r2 = radius * radius;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let dx = 0, dy = 0;
      let inCorner = false;

      if (x < radius && y < radius) {
        dx = radius - x - 1; dy = radius - y - 1; inCorner = true;
      } else if (x >= w - radius && y < radius) {
        dx = x - (w - radius); dy = radius - y - 1; inCorner = true;
      } else if (x < radius && y >= h - radius) {
        dx = radius - x - 1; dy = y - (h - radius); inCorner = true;
      } else if (x >= w - radius && y >= h - radius) {
        dx = x - (w - radius); dy = y - (h - radius); inCorner = true;
      }

      if (inCorner && dx * dx + dy * dy > r2) {
        setPixel(png, x, y, TRANSPARENT);
      }
    }
  }
}

function generateIcon(size, roundedCorners, transparentBg, outputName) {
  const png = createPNG(size, size);

  // Fill background
  if (transparentBg) {
    fill(png, TRANSPARENT);
  } else {
    fill(png, BG);
  }

  // Draw barbell in upper-center area
  const barbellSize = Math.round(size * 0.7);
  const barbellY = Math.round(size * 0.38);
  drawBarbell(png, Math.round(size / 2), barbellY, barbellSize, PURPLE);

  // Draw "FC" text below the barbell
  const letterHeight = Math.round(size * 0.18);
  const textY = Math.round(size * 0.68);
  drawFC(png, Math.round(size / 2), textY, letterHeight, WHITE);

  // Apply rounded corners if needed
  if (roundedCorners) {
    const radius = Math.round(size * 0.18); // ~18% corner radius like iOS
    applyRoundedCornerMask(png, radius);
  }

  // Write to file
  const outputPath = path.join(ASSETS_DIR, outputName);
  const buffer = PNG.sync.write(png);
  fs.writeFileSync(outputPath, buffer);
  console.log(`Generated: ${outputPath} (${size}x${size})`);
}

// Ensure assets directory exists
if (!fs.existsSync(ASSETS_DIR)) {
  fs.mkdirSync(ASSETS_DIR, { recursive: true });
}

// Generate all icons
console.log("Generating FitCore app icons...\n");

generateIcon(1024, true, false, "icon.png");
generateIcon(1024, false, true, "adaptive-icon.png");
generateIcon(200, false, false, "splash-icon.png");
generateIcon(48, false, false, "favicon.png");

console.log("\nAll icons generated successfully!");
