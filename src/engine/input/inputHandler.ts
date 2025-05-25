import { Particle } from '../Particle'

export interface ParticleSpawner {
  spawn(
    centerX: number,
    centerY: number,
    cols: number,
    rows: number,
    createParticle: (x: number, y: number) => void,
    ParticleType: new (x: number, y: number) => Particle,
  ): void
}

export function setupInput(
  canvas: HTMLCanvasElement,
  PIXEL_SIZE: number,
  COLS: number,
  ROWS: number,
  spawner: ParticleSpawner,
  createParticle: (x: number, y: number, ParticleType: new (x: number, y: number) => Particle) => void,
  getCurrentParticleType: () => new (x: number, y: number) => Particle
): void {
  let isDrawing = false
  let currentPos: { x: number; y: number } | null = null
  let intervalId: ReturnType<typeof setInterval> | null = null

  function getMousePos(e: MouseEvent | TouchEvent): { x: number; y: number } | null {
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

    const x = Math.floor((clientX - rect.left) / PIXEL_SIZE)
    const y = Math.floor((clientY - rect.top) / PIXEL_SIZE)

    // Solo devolver si está dentro de los límites
    if (x < 0 || x >= COLS || y < 0 || y >= ROWS) return null

    return { x, y }
  }

  function spawnParticlesAround(pos: { x: number; y: number }) {
    const ParticleType = getCurrentParticleType()
    spawner.spawn(pos.x, pos.y, COLS, ROWS, (x, y) => {
      createParticle(x, y, ParticleType)
    }, ParticleType)
  }

  function startDrawing(pos: { x: number; y: number }) {
    isDrawing = true
    currentPos = pos
    spawnParticlesAround(pos)

    if (!intervalId) {
      intervalId = setInterval(() => {
        if (isDrawing && currentPos) {
          spawnParticlesAround(currentPos)
        }
      }, 16) // ~60fps
    }
  }

  function stopDrawing() {
    isDrawing = false
    currentPos = null
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
  }

  // MOUSE EVENTS

  canvas.addEventListener('mousedown', (e) => {
    const pos = getMousePos(e)
    if (!pos) return
    startDrawing(pos)
  })

  canvas.addEventListener('mouseup', stopDrawing)
  canvas.addEventListener('mouseleave', () => {
    // No parar al salir, solo dejar la posición null
    currentPos = null
  })

  canvas.addEventListener('mouseenter', (e) => {
    // Si estamos dibujando y entramos, retomamos
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
    currentPos = pos
  })

  // TOUCH EVENTS

  canvas.addEventListener('touchstart', (e) => {
    const pos = getMousePos(e)
    if (!pos) return
    e.preventDefault()
    startDrawing(pos)
  }, { passive: false })

  canvas.addEventListener('touchend', (e) => {
    e.preventDefault()
    stopDrawing()
  }, { passive: false })

  canvas.addEventListener('touchcancel', (e) => {
    e.preventDefault()
    stopDrawing()
  }, { passive: false })

  canvas.addEventListener('touchmove', (e) => {
    e.preventDefault()
    if (!isDrawing) return
    const pos = getMousePos(e)
    if (!pos) {
      currentPos = null
      return
    }
    currentPos = pos
  }, { passive: false })
}
