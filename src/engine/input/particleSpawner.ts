// particleSpawner.ts

import { Particle } from '../Particle'

export interface ParticleSpawner {
  spawn(
    centerX: number,
    centerY: number,
    cols: number,
    rows: number,
    createParticle: (x: number, y: number) => void,
    ParticleType: new (x: number, y: number) => Particle,
    maxParticles?: number
  ): void
}

export class ParticleSpawner implements ParticleSpawner {
  radius: number

  constructor(radius: number) {
    this.radius = radius
  }

  spawn(
    centerX: number,
    centerY: number,
    cols: number,
    rows: number,
    createParticle: (x: number, y: number) => void,
    ParticleType: new (x: number, y: number) => Particle,
  ): void {
    for (let dy = -this.radius; dy <= this.radius; dy++) {
      for (let dx = -this.radius; dx <= this.radius; dx++) {
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist <= this.radius) {
          const x = centerX + dx
          const y = centerY + dy
          if (x >= 0 && x < cols && y >= 0 && y < rows) {
            const tempParticle = new ParticleType(x, y)
            if (Math.random() < tempParticle.spawnDensity) {
              createParticle(x, y)
            }
          }
        }
      }
    }
  }
}
