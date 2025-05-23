// Global state variables to control drawing status and current position
let isDrawing: boolean = false
let currentPos: { x: number; y: number } | null = null
let intervalId: ReturnType<typeof setInterval> | null = null

const PARTICLES_PER_TICK = 5
const RADIUS = 2

/**
 * Sets up input event listeners on the canvas to support drawing with both mouse and touch.
 * @param canvas - The HTMLCanvasElement to draw on.
 * @param PIXEL_SIZE - The logical pixel size (scale factor).
 * @param WIDTH - Width of the drawing area in logical pixels.
 * @param HEIGHT - Height of the drawing area in logical pixels.
 * @param createParticle - Callback function to create a particle at (x, y).
 */
function setupInput(
  canvas: HTMLCanvasElement,
  PIXEL_SIZE: number,
  WIDTH: number,
  HEIGHT: number,
  createParticle: (x: number, y: number) => void,
): void {
  /**
   * Gets the logical drawing position from a mouse or touch event,
   * converting screen coordinates to canvas coordinates scaled by PIXEL_SIZE.
   * @param e - MouseEvent or TouchEvent
   * @returns The position {x, y} in logical pixels, or null if unavailable.
   */
  function getPosFromEvent(
    e: MouseEvent | TouchEvent,
  ): { x: number; y: number } | null {
    if (e instanceof MouseEvent) {
      // Mouse event position
      return getMousePos(e, canvas, PIXEL_SIZE)
    } else if (e instanceof TouchEvent) {
      // Touch event position (first touch only)
      if (e.touches.length > 0) {
        const touch = e.touches[0]
        const rect = canvas.getBoundingClientRect()
        return {
          x: Math.floor((touch.clientX - rect.left) / PIXEL_SIZE),
          y: Math.floor((touch.clientY - rect.top) / PIXEL_SIZE),
        }
      }
    }
    return null
  }

  /**
   * Starts drawing: activates drawing state and creates particles at the initial position.
   * Used for both mouse and touch start events.
   */
  function startDrawing(e: MouseEvent | TouchEvent): void {
    e.preventDefault() // Prevent default behaviors like scrolling or zooming
    isDrawing = true
    const pos = getPosFromEvent(e)
    if (pos) {
      currentPos = pos
      createParticlesAround(
        currentPos,
        WIDTH,
        HEIGHT,
        PIXEL_SIZE,
        createParticle,
      )
    }
    // If no interval is running, start one to create particles continuously
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
      }, 16) // About 60 times per second
    }
  }

  /**
   * Stops drawing, resets state, and clears the particle generation interval.
   */
  function stopDrawing(): void {
    isDrawing = false
    currentPos = null
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
  }

  /**
   * Updates current drawing position and creates particles there.
   */
  function moveDrawing(e: MouseEvent | TouchEvent): void {
    e.preventDefault()
    if (!isDrawing) return
    const pos = getPosFromEvent(e)
    if (pos) {
      currentPos = pos
      createParticlesAround(
        currentPos,
        WIDTH,
        HEIGHT,
        PIXEL_SIZE,
        createParticle,
      )
    }
  }

  // Mouse event listeners
  canvas.addEventListener('mousedown', startDrawing)
  canvas.addEventListener('mouseup', stopDrawing)
  canvas.addEventListener('mouseleave', stopDrawing)
  canvas.addEventListener('mousemove', moveDrawing)

  // Touch event listeners
  canvas.addEventListener('touchstart', startDrawing)
  canvas.addEventListener('touchend', stopDrawing)
  canvas.addEventListener('touchcancel', stopDrawing)
  canvas.addEventListener('touchmove', moveDrawing)
}

/**
 * Calculates the mouse position relative to the canvas in logical pixel units.
 * @param e - MouseEvent
 * @param canvas - The canvas element
 * @param PIXEL_SIZE - The logical pixel size scale factor
 * @returns Position {x, y} in logical pixels
 */
function getMousePos(
  e: MouseEvent,
  canvas: HTMLCanvasElement,
  PIXEL_SIZE: number,
): { x: number; y: number } {
  const rect = canvas.getBoundingClientRect()
  return {
    x: Math.floor((e.clientX - rect.left) / PIXEL_SIZE),
    y: Math.floor((e.clientY - rect.top) / PIXEL_SIZE),
  }
}

/**
 * Creates several particles randomly positioned around a center point within a radius,
 * ensuring particles stay within the drawing area bounds.
 * @param centerPos - The central position {x, y} in logical pixels
 * @param WIDTH - Drawing area width in logical pixels
 * @param HEIGHT - Drawing area height in logical pixels
 * @param PIXEL_SIZE - Logical pixel size (not directly used here but kept for interface consistency)
 * @param createParticle - Callback to create a particle at (x, y)
 */
function createParticlesAround(
  centerPos: { x: number; y: number },
  WIDTH: number,
  HEIGHT: number,
  PIXEL_SIZE: number,
  createParticle: (x: number, y: number) => void,
): void {
  for (let i = 0; i < PARTICLES_PER_TICK; i++) {
    // Generate a random point inside a circle with radius RADIUS
    const angle = Math.random() * 2 * Math.PI
    const distance = Math.random() * RADIUS

    const x = Math.round(centerPos.x + Math.cos(angle) * distance)
    const y = Math.round(centerPos.y + Math.sin(angle) * distance)

    // Check if particle is inside canvas bounds
    if (x >= 0 && x < WIDTH && y >= 0 && y < HEIGHT) {
      createParticle(x, y)
    }
  }
}

export { setupInput }
