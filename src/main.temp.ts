// main.ts

import { Particle } from './engine/Particle'

// Select the canvas element and get the 2D rendering context
const canvas = document.querySelector('canvas') as HTMLCanvasElement
const ctx = canvas.getContext('2d')!

const WIDTH = 512
const HEIGHT = 512
const PIXEL_SIZE = 4

canvas.width = WIDTH
canvas.height = HEIGHT

const ROWS = HEIGHT / PIXEL_SIZE
const COLS = WIDTH / PIXEL_SIZE

// Initialize the grid with null particles
const grid: (Particle | null)[][] = Array.from({ length: ROWS }, () =>
  Array(COLS).fill(null),
)

// Draw the grid on the canvas
function draw(): void {
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const cell = grid[y][x]
      if (cell) {
        ctx.fillStyle = cell.color
        ctx.fillRect(x * PIXEL_SIZE, y * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE)
      }
    }
  }
}

// Update the grid particles
function updateGrid(): void {
  for (let y = ROWS - 1; y >= 0; y--) {
    for (let x = 0; x < COLS; x++) {
      const cell = grid[y][x]
      if (cell?.update) {
        cell.update(grid)
      }
    }
  }
}

// Main animation loop
function loop(): void {
  updateGrid()
  updateGrid()
  draw()
  requestAnimationFrame(loop)
}

loop()
