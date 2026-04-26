const canvas = document.getElementById("drawCanvas");
const ctx = canvas.getContext("2d");

let drawing = false;
let currentColor = "#000080";
let currentBrush = "pencil";
let opacity = 100;
const brushSizes = [20, 40, 60, 80, 100];
let brushSizeIndex = 0;
let brushSize = brushSizes[brushSizeIndex];

// Define light levels and colors here
const colorMap = [
  { min: 0,   max: 99,  color: "#000080" }, // Navy
  { min: 100, max: 199, color: "#006400" }, // Dark Green
  { min: 200, max: 299, color: "#800080" }, // Dark Purple
  { min: 300, max: 399, color: "#ffff99" }, // Yellow
  { min: 400, max: 499, color: "#ff0000" }, // Red
  { min: 500, max: 600, color: "#ff8c00" }  // Orange
];

const sizeSlider = document.getElementById("sizeSlider");
const sizeText = document.getElementById("sizeText");
const opacitySlider = document.getElementById("opacitySlider");
const opacityText = document.getElementById("opacityText");

sizeSlider.addEventListener("input", () => {
  brushSize = Number(sizeSlider.value);
  sizeText.textContent = brushSize;
});

opacitySlider.addEventListener("input", () => {
  opacity = Number(opacitySlider.value);
  opacityText.textContent = opacity;
});

canvas.addEventListener("mousedown", () => { drawing = true; });
canvas.addEventListener("mouseup", () => { drawing = false; });
canvas.addEventListener("mouseleave", () => { drawing = false; });
canvas.addEventListener("mousemove", draw);

function setColor(color, button) {
  currentColor = color;
  document.querySelectorAll(".color-btn").forEach((btn) => {
    btn.classList.remove("selected");
  });
  button.classList.add("selected");
}
function updateColorButtonUI(activeColor) {
  document.querySelectorAll(".color-btn").forEach((btn) => {
    // Check if the button's data-color matches the active sensor color
    if (btn.getAttribute("data-color") === activeColor) {
      btn.classList.add("selected");
    } else {
      btn.classList.remove("selected");
    }
  });
}

function setBrush(brush, button) {
  currentBrush = brush;
  document.querySelectorAll(".brush-btn").forEach((btn) => {
    btn.classList.remove("selected");
  });
  button.classList.add("selected");
}

function draw(event) {
  if (!drawing) return;
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  drawShape(x, y);
}

function drawShape(x, y) {
  ctx.globalAlpha = opacity / 100;
  ctx.fillStyle = currentColor;
  ctx.strokeStyle = currentColor;

  if (currentBrush === "pencil") {
    ctx.beginPath();
    ctx.arc(x, y, Math.max(1, brushSize / 10), 0, Math.PI * 2);
    ctx.fill();
  }

  else if (currentBrush === "round") {
    ctx.beginPath();
    ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
    ctx.fill();
  }

  else if (currentBrush === "flat") {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(-0.4);
    ctx.fillRect(-brushSize / 2, -brushSize / 5, brushSize, brushSize / 2.5);
    ctx.restore();
  }

  else if (currentBrush === "spray") {
    for (let i = 0; i < 25; i++) {
      const offsetX = Math.random() * brushSize * 2 - brushSize;
      const offsetY = Math.random() * brushSize * 2 - brushSize;

      if (offsetX * offsetX + offsetY * offsetY <= brushSize * brushSize) {
        ctx.beginPath();
        ctx.arc(x + offsetX, y + offsetY, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  ctx.globalAlpha = 1;
}

function drawStar(cx, cy, spikes, outerRadius, innerRadius) {
  let rotation = (Math.PI / 2) * 3;
  let x = cx;
  let y = cy;
  let step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);

  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rotation) * outerRadius;
    y = cy + Math.sin(rotation) * outerRadius;
    ctx.lineTo(x, y);
    rotation += step;

    x = cx + Math.cos(rotation) * innerRadius;
    y = cy + Math.sin(rotation) * innerRadius;
    ctx.lineTo(x, y);
    rotation += step;
  }

  ctx.closePath();
  ctx.fill();
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function saveCanvas() {
  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = `drawing_${Date.now()}.png`;
  link.click();
}

let autoX = Math.random() * canvas.width;
let autoY = Math.random() * canvas.height;
let angle = Math.random() * Math.PI * 2;
let speed = 5;

function moveAutomated() {
  autoX += Math.cos(angle) * speed;
  autoY += Math.sin(angle) * speed;

  if (autoX < 0 || autoX > canvas.width) angle = Math.PI - angle;
  if (autoY < 0 || autoY > canvas.height) angle = -angle;

  drawShape(autoX, autoY);
  requestAnimationFrame(moveAutomated);
}

function changeDirection() {
  angle = Math.random() * Math.PI * 2;
  const nextChange = (Math.random() * 2 + 1) * 1000;
  setTimeout(changeDirection, nextChange);
}

opacity = 100;
moveAutomated();
changeDirection();

// --- Sensor polling ---
let lastBtn1 = "0";

setInterval(async () => {
  const res = await fetch('/data');
  const d = await res.json();


  // 1. Handle brush Size Logic
  if (d.btn1 === "1" && lastBtn1 === "0") {
    brushSizeIndex = (brushSizeIndex + 1) % brushSizes.length;
    brushSize = brushSizes[brushSizeIndex];
    sizeText.textContent = brushSize;
    sizeSlider.value = brushSize;
  }

  lastBtn1 = d.btn1;

  // 2. Handle Dynamic Color Logic
    const lightVal = parseInt(d.light);
    
    // Find the first range object where the light value fits
    const matchedColor = colorMap.find(range => lightVal >= range.min && lightVal <= range.max);

    if (matchedColor) {
      currentColor = matchedColor.color;
      
      // Update UI button highlights if they exist
      updateColorButtonUI(currentColor);
    }
    const soundVal = parseInt(d.sound);
    if (soundVal >= 200) {
      // Map sound range (200–600) to speed range (10–40)
      speed = 5 + Math.round(((soundVal - 200) / 400) * 30);
    } else {
      speed = 5; 
    } 

}, 100);
