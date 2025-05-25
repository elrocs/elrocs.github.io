import { Particle } from '../Particle'

export interface ParticleSpawner {
  spawn(
    centerX: number,
    centerY: number,
    cols: number,
    rows: number,
    createParticle: (x: number, y: number) => void,
    ParticleType: new (x: number, y: number) => Particle,
  ): void
}

export class ParticleSpawner implements ParticleSpawner {
  radius: number
  particlesPerTick: number

  constructor(radius: number, particlesPerTick: number) {
    this.radius = radius
    this.particlesPerTick = particlesPerTick
  }

  spawn(
    centerX: number,
    centerY: number,
    cols: number,
    rows: number,
    createParticle: (x: number, y: number) => void,
    ParticleType: new (x: number, y: number) => Particle,
  ): void {
    for (let i = 0; i < this.particlesPerTick; i++) {
      const angle = Math.random() * 2 * Math.PI
      const distance = Math.random() * this.radius
      const x = Math.round(centerX + Math.cos(angle) * distance)
      const y = Math.round(centerY + Math.sin(angle) * distance)

      if (x >= 0 && x < cols && y >= 0 && y < rows) {
        const tempParticle = new ParticleType(x, y)
        if (Math.random() < tempParticle.spawnDensity) {
          createParticle(x, y)
        }
      }
    }
  }
}
