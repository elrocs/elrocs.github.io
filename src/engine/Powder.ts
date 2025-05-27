import { Particle } from './Particle.js'
import { Solid } from './Solid.js'

export class Powder extends Solid {
  constructor(x: number, y: number) {
    super(x, y)
  }

  /**
   * Update the powder particle's position in the grid.
   * It tries to fall straight down first,
   * then tries diagonally down-left or down-right randomly.
   */
  update(grid: (Particle | null)[][]): void {
    // Try to fall straight down first
    if (
      this.inbounds(grid, this.x, this.y + 1) &&
      grid[this.y + 1][this.x] === null
    ) {
      this.move_to(grid, this.x, this.y + 1)
    } else {
      // If can't fall straight, check diagonal directions
      const directions: [number, number][] = []

      // Check bottom-left
      if (
        this.inbounds(grid, this.x - 1, this.y + 1) &&
        grid[this.y + 1][this.x - 1] === null
      ) {
        directions.push([-1, 1])
      }

      // Check bottom-right
      if (
        this.inbounds(grid, this.x + 1, this.y + 1) &&
        grid[this.y + 1][this.x + 1] === null
      ) {
        directions.push([1, 1])
      }

      // If one or both diagonal paths are free, choose one randomly
      if (directions.length > 0) {
        const [dx, dy] =
          directions[Math.floor(Math.random() * directions.length)]
        this.move_to(grid, this.x + dx, this.y + dy)
      }
    }
  }
}
