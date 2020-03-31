import { Stage } from '../engine/stage'
import { BaseModulationPlanet } from './basePlanets'


class GatePlanet extends BaseModulationPlanet {
  modulationParams = {
    gate : [0]
  }

  constructor({ distance, steps = 1, phase = 0.0, gate = [0.0, 1.0] } : { distance: number, steps: number, phase? : number, gate? : number[]}) {
    super({distance, steps, phase})

    this.props.fill = 'red'

    this.modulationParams.gate = gate
  }
}

class BurstPlanet extends BaseModulationPlanet {
  modulationParams = {
    repeats : 0.0
  }

  constructor({ distance, repeats, phase = 0.0 } : { distance: number, repeats : number, phase? : number }) {
    super({distance, steps : 1, phase})
    this.props.fill = 'green'

    this.modulationParams.repeats = repeats
  }
}

export { GatePlanet, BurstPlanet }