import { describe, test, expect, beforeEach } from 'vitest'
import { Powder } from './Powder.js'

describe('Powder', () => {
  let grid: Array<Array<Powder | null>>
  const ROWS = 5
  const COLS = 5

  beforeEach(() => {
    // Initialize an empty grid before each test
    grid = Array.from({ length: ROWS }, () => Array(COLS).fill(null))
  })

  test('falls straight down if space below is empty', () => {
    const powder = new Powder(2, 1, 'yellow')
    grid[1][2] = powder

    powder.update(grid)

    expect(grid[1][2]).toBeNull()
    expect(grid[2][2]).toBe(powder)
    expect(powder.x).toBe(2)
    expect(powder.y).toBe(2)
  })

  test('falls diagonally if space below is blocked', () => {
    const powder = new Powder(2, 1, 'yellow')
    grid[1][2] = powder

    // Block the cell directly below
    grid[2][2] = new Powder(2, 2, 'yellow')

    // Diagonal left and right cells are free
    grid[2][1] = null
    grid[2][3] = null

    powder.update(grid)

    // Powder should have moved to either (1, 2) or (3, 2)
    expect(grid[1][2]).toBeNull()
    expect(
      (powder.x === 1 && powder.y === 2 && grid[2][1] === powder) ||
        (powder.x === 3 && powder.y === 2 && grid[2][3] === powder),
    ).toBe(true)
  })

  test('does not move if no space is available', () => {
    const powder = new Powder(2, 1, 'yellow')
    grid[1][2] = powder

    // Block the cell below and diagonals
    grid[2][2] = new Powder(2, 2, 'yellow')
    grid[2][1] = new Powder(1, 2, 'yellow')
    grid[2][3] = new Powder(3, 2, 'yellow')

    powder.update(grid)

    // Powder should stay in place
    expect(grid[1][2]).toBe(powder)
    expect(powder.x).toBe(2)
    expect(powder.y).toBe(1)
  })
})
