      const canvas = document.getElementById("drawCanvas");
      const ctx = canvas.getContext("2d");

      let drawing = false;
      let currentColor = "#000080";
      let currentBrush = "circle";
      let brushSize = 20;
      let opacity = 1;

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

      canvas.addEventListener("mousedown", () => {
        drawing = true;
      });

      canvas.addEventListener("mouseup", () => {
        drawing = false;
      });

      canvas.addEventListener("mouseleave", () => {
        drawing = false;
      });

      canvas.addEventListener("mousemove", draw);

      function setColor(color, button) {
        currentColor = color;

        document.querySelectorAll(".color-btn").forEach((btn) => {
          btn.classList.remove("selected");
        });

        button.classList.add("selected");
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
        ctx.globalAlpha = opacity;
        ctx.fillStyle = currentColor;

        if (currentBrush === "circle") {
          ctx.beginPath();
          ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (currentBrush === "square") {
          ctx.fillRect(
            x - brushSize / 2,
            y - brushSize / 2,
            brushSize,
            brushSize,
          );
        } else if (currentBrush === "triangle") {
          ctx.beginPath();
          ctx.moveTo(x, y - brushSize / 2);
          ctx.lineTo(x - brushSize / 2, y + brushSize / 2);
          ctx.lineTo(x + brushSize / 2, y + brushSize / 2);
          ctx.closePath();
          ctx.fill();
        } else if (currentBrush === "star") {
          drawStar(x, y, 5, brushSize / 2, brushSize / 4);
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