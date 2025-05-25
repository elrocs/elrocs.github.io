// main.ts

import { setupInput } from './engine/input/inputHandler'

import { Sand } from './engine/elements/Sand'
import { Particle } from './engine/Particle'
import { ParticleSpawner } from './engine/input/particleSpawner'  // Asumo que esta clase la tienes exportada

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

type ParticleConstructor = new (x: number, y: number) => Particle
let currentParticleType: ParticleConstructor = Sand

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

// ParticleSpawner instance
const spawner = new ParticleSpawner(5, 8) // por ejemplo, radio=5, 8 partículas por tick

// Function to create a particle at (x, y) of a specific type if espacio libre
function createParticle(x: number, y: number, ParticleType: ParticleConstructor): void {
  if (grid[y][x] === null) {
    grid[y][x] = new ParticleType(x, y)
  }
}

// Función para devolver el tipo de partícula actual seleccionada
function getCurrentParticleType(): ParticleConstructor {
  return currentParticleType
}

// Setup input with la nueva función
setupInput(
  canvas,
  PIXEL_SIZE,
  COLS,
  ROWS,
  spawner,
  createParticle,
  getCurrentParticleType,
)

// Main animation loop
function loop(): void {
  updateGrid()
  updateGrid() // doble update para estabilidad o precisión física
  draw()
  requestAnimationFrame(loop)
}

loop()
