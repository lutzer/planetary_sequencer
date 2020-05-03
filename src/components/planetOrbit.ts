import { NotePlanetProperties, NotePlanet } from "./planets"
import { Stage } from "../engine/stage"
import { CanvasElement } from "../engine/canvasElement"
import { toDOMMatrix } from "../engine/utils"
import _ from "lodash"
import { PlanetSystem, PlanetSystemState } from "./planetSystem"

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
  opacity: 1.0,
  strokeWidth: 0.5,
  innerRadius : 0.2,
  radiusDistance: 0.1
}

class PlanetOrbit extends CanvasElement {

  props : PlanetOrbitProperties

  planets : NotePlanet[] = []

  constructor(props: PlanetOrbitProperties, parent: CanvasElement) {
    super({parent: parent})
    this.props = props

    this.planets = props.planets.map( (p) => new NotePlanet(p, this))
  }

  render(stage : Stage, state: PlanetSystemState, orbitIndex: number) {
    const context = stage.context
    const { bpm } = state
    const { steps, speed } = this.props
    const { fill, opacity, stroke, strokeWidth, innerRadius, radiusDistance } = style
    const transform = this.transformMatrix
    const orbitRadius = innerRadius + orbitIndex * radiusDistance

    context.setTransform(toDOMMatrix(transform))

    context.lineWidth = strokeWidth / this.absoluteScale
    context.fillStyle = fill
    context.strokeStyle = stroke
    context.globalAlpha = opacity

    // draw orbit circle
    context.beginPath()
    context.arc(0, 0, orbitRadius, 0, 2*Math.PI)
    context.closePath()
    context.stroke()

    // draw steps
    _.range(steps).forEach( (step) => {
      const angle = step / steps * Math.PI*2
      const p = [ Math.cos(angle) * orbitRadius, Math.sin(angle) * orbitRadius ]
      context.beginPath()
      context.arc(p[0], p[1], 0.005, 0, 2*Math.PI)
      context.closePath()
      context.fill()
      context.stroke()
    })

    // draw cursor
    const orbitalPeriod = speed * 240 / bpm * 1000
    const cursorAngle = state.time * Math.PI * 2 / orbitalPeriod
    drawCursor(stage, cursorAngle, orbitRadius)
    

    this.planets.forEach( (planet) => planet.render(stage, orbitRadius))
  }

}

function drawCursor(stage: Stage, angle: number, orbitRadius: number) {
  const context = stage.context
  const offset = 0.01
  const p1 = [ Math.cos(-angle) * (orbitRadius - offset), Math.sin(-angle) * (orbitRadius - offset) ]
  const p2 = [ Math.cos(-angle) * (orbitRadius + offset), Math.sin(-angle) * (orbitRadius + offset) ]
  const p3 = [ Math.cos(-angle - offset/orbitRadius) * (orbitRadius), Math.sin(-angle - offset/orbitRadius) * (orbitRadius) ]
  context.fillStyle = 'white'
  context.beginPath()
  context.moveTo(p1[0],p1[1])
  context.lineTo(p2[0],p2[1])
  context.lineTo(p3[0],p3[1])
  context.closePath()
  context.fill()
  context.stroke()
}

export { PlanetOrbitProperties, PlanetOrbit }