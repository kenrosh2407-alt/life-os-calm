const { createCanvas } = require("canvas");
const fs = require("fs");
const path = require("path");

const sizes = [192, 512];
const outDir = path.join(__dirname, "public/icons");
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

function drawIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext("2d");

  // gradient background
  const grad = ctx.createLinearGradient(0, 0, size, size);
  grad.addColorStop(0, "#66A6FF");
  grad.addColorStop(1, "#89F7FE");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  // white text
  ctx.fillStyle = "#fff";
  ctx.font = `${size / 4}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("LifeOS", size / 2, size / 2);

  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync(path.join(outDir, `icon-${size}x${size}.png`), buffer);
  console.log(`✅ Generated icon-${size}x${size}.png`);
}

sizes.forEach(drawIcon);
