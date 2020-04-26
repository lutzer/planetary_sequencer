import { NotePlanetProperties } from "./planets"

type PlanetOrbitProperties = {
  speed : number
  steps: number
  snap : boolean
  planets : NotePlanetProperties[]
  priority : 0
}

class PlanetOrbit {

}

export { PlanetOrbitProperties }