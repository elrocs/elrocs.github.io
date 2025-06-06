import { Particle } from './Particle.js'

// Extend the Particle base class with specific properties for Solid particles
export class Solid extends Particle {
  // Define constructor with typed parameters
  constructor(x: number, y: number, color: string) {
    super(x, y, color)
  }
}
