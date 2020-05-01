import { NotePlanetProperties, NotePlanet } from "./planets"
import { Stage } from "../engine/stage"
import { CanvasElement } from "../engine/canvasElement"
import { toDOMMatrix } from "../engine/utils"

type PlanetOrbitProperties = {
  speed : number
  steps: number
  snap : boolean
  planets : NotePlanetProperties[]
  priority : number
}

const style = {
  fill: 'white',
  stroke: 'black',
  opacity: 0.2,
  strokeWidth: 1.0
}

class PlanetOrbit extends CanvasElement {

  props : PlanetOrbitProperties

  planets : NotePlanet[] = []

  constructor(props: PlanetOrbitProperties, parent: CanvasElement) {
    super({parent: parent})
    this.props = props

    this.planets = props.planets.map( (p) => new NotePlanet(p, this))
  }

  render(stage : Stage, distance = 0.0) {
    const context = stage.context
    const { fill, opacity, stroke, strokeWidth } = style
    const transform = this.transformMatrix

    context.setTransform(toDOMMatrix(transform))

    context.lineWidth = strokeWidth / this.absoluteScale
    context.fillStyle = fill
    context.strokeStyle = stroke
    context.globalAlpha = opacity

    context.beginPath()
    context.arc(0, 0, distance, 0, 2*Math.PI)
    context.closePath()
    context.stroke()

    this.planets.forEach( (planet) => planet.render(stage, distance))
  }

}

export { PlanetOrbitProperties, PlanetOrbit }