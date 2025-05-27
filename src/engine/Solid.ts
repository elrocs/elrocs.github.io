import { Particle } from '@engine/Particle'

// Extend the Particle base class with specific properties for Solid particles
export class Solid extends Particle {
  // Define constructor with typed parameters
  constructor(x: number, y: number) {
    super(x, y)
  }
}
