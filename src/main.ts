import { Grid } from '@core/Grid'
import { ParticleSpawner } from '@core/ParticleSpawner'
import { Cobble } from '@particles/Cobble'
import { Sand } from '@particles/Sand'

const canvas = document.querySelector('canvas') as HTMLCanvasElement

const WIDTH = 512
const HEIGHT = 512
const PIXEL_SIZE = 4

let grid = new Grid(canvas, WIDTH, HEIGHT, PIXEL_SIZE)

let spawner = new ParticleSpawner(grid.grid, 5, grid.COLS, grid.ROWS)

canvas.addEventListener('click', (event) => {
  const rect = canvas.getBoundingClientRect()
  const x = Math.floor((event.clientX - rect.left) / PIXEL_SIZE)
  const y = Math.floor((event.clientY - rect.top) / PIXEL_SIZE)
  spawner.create(x, y, (x, y) => new Sand(x, y))
})

function loop(): void {
  grid.update()
  grid.draw()
  requestAnimationFrame(loop)
}

loop()
