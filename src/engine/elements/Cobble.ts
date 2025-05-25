import { Solid } from '../Solid'

export class Cobble extends Solid {
  constructor(x: number, y: number) {
    super(x, y)
    this.spawnDensity = 0.6
    this.color = 'gray'
  }
}
