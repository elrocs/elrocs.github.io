import { Powder } from '../Powder.js'

export class Sand extends Powder {
  constructor(x: number, y: number) {
    super(x, y)
    this.spawnDensity = 0.4
    this.color = 'goldenrod'
  }
}
