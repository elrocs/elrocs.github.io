// inputHandler.ts

import { Particle } from '../Particle'
import { ParticleSpawner } from './particleSpawner'

/**
 * Sets up input handling on the canvas for spawning particles.
 * Supports mouse and touch events, and interpolates particle spawning
 * to avoid gaps when moving the cursor or finger quickly.
 *
 * @param canvas - The HTML canvas element where particles are spawned.
 * @param PIXEL_SIZE - The size of each particle cell in pixels.
 * @param COLS - Number of columns in the particle grid.
 * @param ROWS - Number of rows in the particle grid.
 * @param spawner - ParticleSpawner instance to handle spawning logic.
 * @param createParticle - Function to create a particle at given coordinates.
 * @param getCurrentParticleType - Function returning the current Particle class to spawn.
 */
export function setupInput(
  canvas: HTMLCanvasElement,
  PIXEL_SIZE: number,
  COLS: number,
  ROWS: number,
  spawner: ParticleSpawner,
  createParticle: (
    x: number,
    y: number,
    ParticleType: new (x: number, y: number) => Particle,
  ) => void,
  getCurrentParticleType: () => new (x: number, y: number) => Particle,
): void {
  // Flag indicating whether the user is currently drawing (holding down mouse/touch)
  let isDrawing = false

  // Current cursor or touch position in particle grid coordinates
  let currentPos: { x: number; y: number } | null = null

  // Last position where particles were spawned, used for interpolation
  let lastSpawnPos: { x: number; y: number } | null = null

  // Interval ID for continuous spawning while drawing
  let intervalId: ReturnType<typeof setInterval> | null = null

  /**
   * Converts mouse or touch event coordinates to particle grid coordinates.
   * Returns null if position is out of bounds or invalid.
   */
  function getMousePos(
    e: MouseEvent | TouchEvent,
  ): { x: number; y: number } | null {
    const rect = canvas.getBoundingClientRect()
    let clientX: number | null = null
    let clientY: number | null = null

    if (e instanceof MouseEvent) {
      clientX = e.clientX
      clientY = e.clientY
    } else if (e instanceof TouchEvent) {
      if (e.touches.length > 0) {
        clientX = e.touches[0].clientX
        clientY = e.touches[0].clientY
      } else if (e.changedTouches.length > 0) {
        clientX = e.changedTouches[0].clientX
        clientY = e.changedTouches[0].clientY
      }
    }

    if (clientX === null || clientY === null) return null

    // Convert from pixel coordinates to grid indices
    const x = Math.floor((clientX - rect.left) / PIXEL_SIZE)
    const y = Math.floor((clientY - rect.top) / PIXEL_SIZE)

    // Return null if outside grid bounds
    if (x < 0 || x >= COLS || y < 0 || y >= ROWS) return null

    return { x, y }
  }

  /**
   * Spawns particles around a given position using the ParticleSpawner instance.
   */
  function spawnParticlesAround(pos: { x: number; y: number }) {
    const ParticleType = getCurrentParticleType()
    spawner.spawn(
      pos.x,
      pos.y,
      COLS,
      ROWS,
      (x, y) => {
        createParticle(x, y, ParticleType)
      },
      ParticleType,
    )
  }

  /**
   * Interpolates between two positions and spawns particles along the line.
   * This prevents gaps when the mouse/touch moves quickly.
   */
  function spawnParticlesBetween(
    p1: { x: number; y: number },
    p2: { x: number; y: number },
  ) {
    const dx = p2.x - p1.x
    const dy = p2.y - p1.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    const steps = Math.ceil(dist)

    for (let i = 0; i <= steps; i++) {
      // Calculate interpolated position, rounding to nearest integer grid cell
      const x = Math.round(p1.x + (dx * i) / steps)
      const y = Math.round(p1.y + (dy * i) / steps)
      spawnParticlesAround({ x, y })
    }
  }

  /**
   * Starts the drawing process when user presses mouse down or touches screen.
   * Initializes positions and starts an interval to continuously spawn particles.
   */
  function startDrawing(pos: { x: number; y: number }) {
    isDrawing = true
    currentPos = pos
    lastSpawnPos = pos
    spawnParticlesAround(pos)

    if (!intervalId) {
      intervalId = setInterval(() => {
        if (isDrawing && currentPos) {
          if (
            lastSpawnPos &&
            (lastSpawnPos.x !== currentPos.x || lastSpawnPos.y !== currentPos.y)
          ) {
            spawnParticlesBetween(lastSpawnPos, currentPos)
          } else {
            spawnParticlesAround(currentPos)
          }
          lastSpawnPos = currentPos
        }
      }, 16)
    }
  }

  /**
   * Stops the drawing process when user releases mouse or touch.
   * Clears interval and resets state.
   */
  function stopDrawing() {
    isDrawing = false
    currentPos = null
    lastSpawnPos = null
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
  }

  // --- MOUSE EVENT HANDLERS ---

  canvas.addEventListener('mousedown', (e) => {
    const pos = getMousePos(e)
    if (!pos) return
    startDrawing(pos)
  })

  canvas.addEventListener('mouseup', stopDrawing)

  // When mouse leaves canvas, we keep drawing but lose current position
  canvas.addEventListener('mouseleave', () => {
    currentPos = null
  })

  // When mouse re-enters, resume drawing with updated position if drawing was active
  canvas.addEventListener('mouseenter', (e) => {
    if (isDrawing) {
      const pos = getMousePos(e)
      if (pos) currentPos = pos
    }
  })

  canvas.addEventListener('mousemove', (e) => {
    if (!isDrawing) return
    const pos = getMousePos(e)
    if (!pos) {
      currentPos = null
      return
    }

    // Interpolate and spawn particles between last spawn position and new position
    if (lastSpawnPos) {
      spawnParticlesBetween(lastSpawnPos, pos)
    } else {
      spawnParticlesAround(pos)
    }

    currentPos = pos
    lastSpawnPos = pos
  })

  // --- TOUCH EVENT HANDLERS ---

  canvas.addEventListener(
    'touchstart',
    (e) => {
      const pos = getMousePos(e)
      if (!pos) return
      e.preventDefault()
      startDrawing(pos)
    },
    { passive: false },
  )

  canvas.addEventListener(
    'touchend',
    (e) => {
      e.preventDefault()
      stopDrawing()
    },
    { passive: false },
  )

  canvas.addEventListener(
    'touchcancel',
    (e) => {
      e.preventDefault()
      stopDrawing()
    },
    { passive: false },
  )

  canvas.addEventListener(
    'touchmove',
    (e) => {
      e.preventDefault()
      if (!isDrawing) return
      const pos = getMousePos(e)
      if (!pos) {
        currentPos = null
        return
      }

      // Interpolate spawn for touch moves as well
      if (lastSpawnPos) {
        spawnParticlesBetween(lastSpawnPos, pos)
      } else {
        spawnParticlesAround(pos)
      }

      currentPos = pos
      lastSpawnPos = pos
    },
    { passive: false },
  )
}
