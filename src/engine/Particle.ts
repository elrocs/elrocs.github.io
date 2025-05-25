export class Particle {
  x: number
  y: number
  color: string
  spawnDensity: number

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
    this.spawnDensity = 1
    this.color = '#fff'
  }

  /**
   * Check if the given (x, y) position is inside the grid bounds.
   * @param grid - 2D array representing the particle grid
   * @param x - x coordinate to check
   * @param y - y coordinate to check
   * @returns true if (x, y) is inside grid bounds
   */
  inbounds(grid: (Particle | null)[][], x: number, y: number): boolean {
    return y >= 0 && y < grid.length && x >= 0 && x < grid[y].length
  }

  /**
   * Move the particle to new coordinates if the position is free and in bounds.
   * Updates the grid accordingly.
   * @param grid - 2D array representing the particle grid
   * @param new_x - new x coordinate to move to
   * @param new_y - new y coordinate to move to
   */
  move_to(grid: (Particle | null)[][], new_x: number, new_y: number): void {
    if (this.inbounds(grid, new_x, new_y) && grid[new_y][new_x] === null) {
      grid[this.y][this.x] = null
      this.x = new_x
      this.y = new_y
      grid[new_y][new_x] = this
    }
  }

  update?(grid: (Particle | null)[][]): void

}
