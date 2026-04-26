const canvas = document.getElementById("drawCanvas");
const ctx = canvas.getContext("2d");

let drawing = false;
let currentColor = "#000080";
let currentBrush = "pencil";
const brushSizes = [20, 40, 60, 80, 100];
let brushSizeIndex = 0;
let brushSize = brushSizes[brushSizeIndex];

const colorMap = [
  { min: 0,   max: 25,  color: "#000029" }, 
  { min: 26,   max: 80,  color: "#000057" },
  { min: 81,   max: 120,  color: "#260090" },
  { min: 121,   max: 160,  color: "#58008f" },
  { min: 161,   max: 200,  color: "#084101" },
  { min: 201,   max: 240,  color: "#035b00" },
  { min: 241,   max: 280,  color: "#003240" },
  { min: 281,   max: 320,  color: "#004a51" },
  { min: 321,   max: 360,  color: "#ff8181" },
  { min: 361,   max: 400,  color: "#ff3a3a" },
  { min: 401,   max: 440,  color: "#fff34d" },
  { min: 441, max: 480, color: "#fffa71" }, // Dark Green
  { min: 481, max: 520, color: "#e5773c" }, // Dark Purple
  { min: 521, max: 575, color: "#ff9532" }, // Yellow
  { min: 576, max: 600, color: "#ffd9b5" } // Red
];

const sizeSlider = document.getElementById("sizeSlider");
const sizeText = document.getElementById("sizeText");

sizeSlider.addEventListener("input", () => {
  brushSize = Number(sizeSlider.value);
  sizeText.textContent = brushSize;
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
  ctx.fillStyle = currentColor;
  ctx.strokeStyle = currentColor;

  if (currentBrush === "pencil") {
    ctx.beginPath();
    ctx.arc(x, y, Math.max(1, brushSize / 10), 0, Math.PI * 2);
    ctx.fill();
  } else if (currentBrush === "round") {
    ctx.beginPath();
    ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
    ctx.fill();
  } else if (currentBrush === "flat") {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(-0.4);
    ctx.fillRect(-brushSize / 2, -brushSize / 5, brushSize, brushSize / 2.5);
    ctx.restore();
  } else if (currentBrush === "spray") {
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

moveAutomated();
changeDirection();

// --- Sensor polling ---
let lastBtn1 = "0";
let lastBtn2 = "0";

const brushTypes = ["pencil", "round", "flat", "spray"];
let brushTypeIndex = 0;

setInterval(async () => {
  const res = await fetch('/data');
  const d = await res.json();

  if (!d.light || !d.sound || !d.btn1 || !d.btn2) return;

  // 1. Handle Brush Size Logic (btn1)
  if (d.btn1 === "1" && lastBtn1 === "0") {
    brushSizeIndex = (brushSizeIndex + 1) % brushSizes.length;
    brushSize = brushSizes[brushSizeIndex];
    sizeText.textContent = brushSize;
    sizeSlider.value = brushSize;
  }
  lastBtn1 = d.btn1;

  // 2. Handle Brush Type Logic (btn2)
  if (d.btn2 === "1" && lastBtn2 === "0") {
    brushTypeIndex = (brushTypeIndex + 1) % brushTypes.length;
    currentBrush = brushTypes[brushTypeIndex];

    document.querySelectorAll(".brush-btn").forEach((btn, i) => {
      btn.classList.toggle("selected", i === brushTypeIndex);
    });
  }
  lastBtn2 = d.btn2;

  // 3. Handle Dynamic Color Logic
  const lightVal = parseInt(d.light);
  const matchedColor = colorMap.find(range => lightVal >= range.min && lightVal <= range.max);
  if (matchedColor) {
    currentColor = matchedColor.color;
    updateColorButtonUI(currentColor);
  }

  // 4. Handle Dynamic Speed Logic (Sound)
  const soundVal = parseInt(d.sound);
  if (soundVal >= 200) {
    speed = 3 + Math.round(((soundVal - 200) / 400) * 37);
  } else {
    speed = 3;
  }

}, 100);