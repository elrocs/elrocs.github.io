let isDrawing = false;
let currentPos = null;
let intervalId = null;

const PARTICLES_PER_TICK = 5;  // número de partículas generadas cada intervalo
const RADIUS = 2;              // radio en píxeles (en unidades de PIXEL_SIZE) alrededor del cursor

function setupInput(canvas, PIXEL_SIZE, WIDTH, HEIGHT, createParticle) {
  canvas.addEventListener("mousedown", (e) => {
    isDrawing = true;
    currentPos = getMousePos(e, canvas, PIXEL_SIZE);
    createParticlesAround(currentPos, WIDTH, HEIGHT, PIXEL_SIZE, createParticle);

    if (!intervalId) {
      intervalId = setInterval(() => {
        if (isDrawing && currentPos) {
          createParticlesAround(currentPos, WIDTH, HEIGHT, PIXEL_SIZE, createParticle);
        }
      }, 16); // ~60 veces por segundo
    }
  });

  function stopDrawing() {
    isDrawing = false;
    currentPos = null;
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  canvas.addEventListener("mouseup", stopDrawing);
  canvas.addEventListener("mouseleave", stopDrawing);

  canvas.addEventListener("mousemove", (e) => {
    if (!isDrawing) return;
    currentPos = getMousePos(e, canvas, PIXEL_SIZE);
    createParticlesAround(currentPos, WIDTH, HEIGHT, PIXEL_SIZE, createParticle);
  });
}

function getMousePos(e, canvas, PIXEL_SIZE) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: Math.floor((e.clientX - rect.left) / PIXEL_SIZE),
    y: Math.floor((e.clientY - rect.top) / PIXEL_SIZE),
  };
}

function createParticlesAround(centerPos, WIDTH, HEIGHT, PIXEL_SIZE, createParticle) {
  for (let i = 0; i < PARTICLES_PER_TICK; i++) {
    // Generar un punto aleatorio dentro del círculo de radio RADIUS
    const angle = Math.random() * 2 * Math.PI;
    const distance = Math.random() * RADIUS;

    const x = Math.round(centerPos.x + Math.cos(angle) * distance);
    const y = Math.round(centerPos.y + Math.sin(angle) * distance);

    // Comprobar que esté dentro de los límites
    if (x >= 0 && x < WIDTH && y >= 0 && y < HEIGHT) {
      createParticle(x, y);
    }
  }
}

export { setupInput };
