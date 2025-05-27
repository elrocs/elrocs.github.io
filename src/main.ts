import { Grid } from '@core/Grid'

const canvas = document.querySelector('canvas') as HTMLCanvasElement

const WIDTH = 512
const HEIGHT = 512
const PIXEL_SIZE = 4

let grid = new Grid(canvas, WIDTH, HEIGHT, PIXEL_SIZE)

function loop(): void {
  grid.update()
  grid.draw()
  requestAnimationFrame(loop)
}

loop()
