// inputHandler.ts

type ParticleConstructor = new (x: number, y: number) => any

export function setupInput(
  canvas: HTMLCanvasElement,
  PIXEL_SIZE: number,
  COLS: number,
  ROWS: number,
  createParticle: (x: number, y: number, ParticleType: ParticleConstructor) => void,
  getCurrentParticleType: () => ParticleConstructor
): void {
  let isDrawing = false
  let currentPos: { x: number; y: number } | null = null
  let intervalId: ReturnType<typeof setInterval> | null = null

  const PARTICLES_PER_TICK = 5
  const RADIUS = 2

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

  function createParticlesAround(centerPos: { x: number; y: number }) {
    const ParticleType = getCurrentParticleType()

    for (let i = 0; i < PARTICLES_PER_TICK; i++) {
      const angle = Math.random() * 2 * Math.PI
      const distance = Math.random() * RADIUS

      const x = Math.round(centerPos.x + Math.cos(angle) * distance)
      const y = Math.round(centerPos.y + Math.sin(angle) * distance)

      if (x >= 0 && x < COLS && y >= 0 && y < ROWS) {
        createParticle(x, y, ParticleType)
      }
    }
  }

  function stopDrawing(): void {
    isDrawing = false
    currentPos = null
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
  }

  canvas.addEventListener('mousedown', (e: MouseEvent) => {
    isDrawing = true
    currentPos = getMousePos(e, canvas, PIXEL_SIZE)
    createParticlesAround(currentPos)

    if (!intervalId) {
      intervalId = setInterval(() => {
        if (isDrawing && currentPos) {
          createParticlesAround(currentPos)
        }
      }, 16)
    }
  })

  canvas.addEventListener('mouseup', stopDrawing)
  canvas.addEventListener('mouseleave', stopDrawing)

  canvas.addEventListener('mousemove', (e: MouseEvent) => {
    if (!isDrawing) return
    currentPos = getMousePos(e, canvas, PIXEL_SIZE)
    createParticlesAround(currentPos)
  })
}
