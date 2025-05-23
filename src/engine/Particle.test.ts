import { describe, it, expect, beforeEach } from 'vitest'
import { Particle } from './Particle'

describe('Particle class', () => {
  let grid: Array<Array<Particle | null>>
  let particle: Particle

  beforeEach(() => {
    grid = Array.from({ length: 3 }, () => Array(3).fill(null))
    particle = new Particle(1, 1, 'red')
    grid[1][1] = particle
  })

  it('should be in bounds for valid positions', () => {
    expect(particle.inbounds(grid, 0, 0)).toBe(true)
    expect(particle.inbounds(grid, 2, 2)).toBe(true)
    expect(particle.inbounds(grid, 1, 1)).toBe(true)
  })

  it('should be out of bounds for invalid positions', () => {
    expect(particle.inbounds(grid, -1, 0)).toBe(false)
    expect(particle.inbounds(grid, 0, -1)).toBe(false)
    expect(particle.inbounds(grid, 3, 1)).toBe(false)
    expect(particle.inbounds(grid, 1, 3)).toBe(false)
  })

  it('should move particle to new valid empty position', () => {
    particle.move_to(grid, 2, 2)
    expect(particle.x).toBe(2)
    expect(particle.y).toBe(2)
    expect(grid[2][2]).toBe(particle)
    expect(grid[1][1]).toBe(null)
  })

  it('should NOT move particle if target is out of bounds', () => {
    particle.move_to(grid, 3, 3)
    expect(particle.x).toBe(1)
    expect(particle.y).toBe(1)
    expect(grid[1][1]).toBe(particle)
  })

  it('should NOT move particle if target position is occupied', () => {
    const otherParticle = new Particle(2, 2, 'blue')
    grid[2][2] = otherParticle

    particle.move_to(grid, 2, 2)
    expect(particle.x).toBe(1)
    expect(particle.y).toBe(1)
    expect(grid[1][1]).toBe(particle)
  })
})
