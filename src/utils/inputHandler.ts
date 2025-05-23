// Global variables with types
let isDrawing: boolean = false
// currentPos can be an object with x and y or null when no position is set
let currentPos: { x: number; y: number } | null = null
// intervalId can be the return type of setInterval or null
let intervalId: ReturnType<typeof setInterval> | null = null

const PARTICLES_PER_TICK = 5
const RADIUS = 2

// Define types for the setupInput function parameters
function setupInput(
  canvas: HTMLCanvasElement,
  PIXEL_SIZE: number,
  WIDTH: number,
  HEIGHT: number,
  createParticle: (x: number, y: number) => void
): void {
  canvas.addEventListener('mousedown', (e: MouseEvent) => {
    isDrawing = true
    currentPos = getMousePos(e, canvas, PIXEL_SIZE)
    createParticlesAround(currentPos, WIDTH, HEIGHT, PIXEL_SIZE, createParticle)

    if (!intervalId) {
      intervalId = setInterval(() => {
        if (isDrawing && currentPos) {
          createParticlesAround(
            currentPos,
            WIDTH,
            HEIGHT,
            PIXEL_SIZE,
            createParticle,
          )
        }
      }, 16) // ~60 times per second
    }
  })

  // Stop drawing function with explicit void return type
  function stopDrawing(): void {
    isDrawing = false
    currentPos = null
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
  }

  canvas.addEventListener('mouseup', stopDrawing)
  canvas.addEventListener('mouseleave', stopDrawing)

  canvas.addEventListener('mousemove', (e: MouseEvent) => {
    if (!isDrawing) return
    currentPos = getMousePos(e, canvas, PIXEL_SIZE)
    createParticlesAround(currentPos, WIDTH, HEIGHT, PIXEL_SIZE, createParticle)
  })
}

// Explicit return type for getMousePos
function getMousePos(
  e: MouseEvent,
  canvas: HTMLCanvasElement,
  PIXEL_SIZE: number
): { x: number; y: number } {
  const rect = canvas.getBoundingClientRect()
  return {
    x: Math.floor((e.clientX - rect.left) / PIXEL_SIZE),
    y: Math.floor((e.clientY - rect.top) / PIXEL_SIZE),
  }
}

// Define types for createParticlesAround function parameters and return
function createParticlesAround(
  centerPos: { x: number; y: number },
  WIDTH: number,
  HEIGHT: number,
  PIXEL_SIZE: number,
  createParticle: (x: number, y: number) => void
): void {
  for (let i = 0; i < PARTICLES_PER_TICK; i++) {
    // Generate a random point within a circle of radius RADIUS
    const angle = Math.random() * 2 * Math.PI
    const distance = Math.random() * RADIUS

    const x = Math.round(centerPos.x + Math.cos(angle) * distance)
    const y = Math.round(centerPos.y + Math.sin(angle) * distance)

    // Check if point is within bounds
    if (x >= 0 && x < WIDTH && y >= 0 && y < HEIGHT) {
      createParticle(x, y)
    }
  }
}

export { setupInput }
