import { Particle } from '@engine/Particle'

/**
 * The Grid class represents a 2D grid-based canvas system where each cell
 * can hold a Particle object. It handles rendering and updating of particles.
 */
export class Grid {
  private readonly canvas: HTMLCanvasElement
  private readonly ctx: CanvasRenderingContext2D
  private readonly WIDTH: number
  private readonly HEIGHT: number
  private readonly PIXEL_SIZE: number
  private readonly COLS: number
  private readonly ROWS: number
  private grid: (Particle | null)[][]

  /**
   * Initializes a new Grid instance
   *
   * @param canvas - The HTML canvas element to render the grid on.
   * @param width - The total width of the grid in pixels
   * @param height - The total height of the grid in pixels
   * @param pixelSize - The size of each individual grid cell in pixels
   */
  constructor(
    canvas: HTMLCanvasElement,
    width: number,
    height: number,
    pixelSize: number,
  ) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')!
    this.WIDTH = width
    this.HEIGHT = height
    this.PIXEL_SIZE = pixelSize

    // Set canvas dimensios
    this.canvas.width = this.WIDTH
    this.canvas.height = this.HEIGHT

    // Calculate number of columns and rows based on pixel size
    this.COLS = this.WIDTH / this.PIXEL_SIZE
    this.ROWS = this.HEIGHT / this.PIXEL_SIZE

    // Initialize the 2D grid with null values (no particles)
    this.grid = Array.from({ length: this.ROWS }, () =>
      Array(this.COLS).fill(null),
    )
  }

  /**
   * Renders all particles (non-null) on the canvas
   */
  public draw(): void {
    // Clear the entire canvas before drawing
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    // Iterate over each cell in the grid
    for (let y = 0; y < this.ROWS; y++) {
      for (let x = 0; x < this.COLS; x++) {
        const cell = this.grid[y][x]

        // If a particle exists in this cell, draw it
        if (cell) {
          this.ctx.fillStyle = cell.color
          this.ctx.fillRect(
            x * this.PIXEL_SIZE,
            y * this.PIXEL_SIZE,
            this.PIXEL_SIZE,
            this.PIXEL_SIZE,
          )
        }
      }
    }
  }

  /**
   * Updates the state of all particles in the grid.
   * Calls the `update` method on each non-null particle.
   */
  public update(): void {
    for (let y = 0; y < this.ROWS; y++) {
      for (let x = 0; x < this.COLS; x++) {
        const cell = this.grid[y][x]

        // If the cell contains a particle with an update method, call it
        if (cell?.update) {
          cell.update(this.grid)
        }
      }
    }
  }
}
