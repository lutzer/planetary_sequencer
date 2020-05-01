import { Stage } from "../engine/stage";
import { PlanetOrbitProperties, PlanetOrbit } from "./planetOrbit";
import { CanvasMouseEvent } from "../engine/canvasMouse";
import { TriggerScheduler } from "./triggerScheduler";
import _ from "lodash";
import { CanvasElement } from "../engine/canvasElement";
import { toDOMMatrix } from "../engine/utils";

type PlanetSystemState = {
  time: number
  selected: boolean
}

type PlanetSystemProperties = {
  channel: number
  noteRoot: number
  noteScale: string
  orbits: PlanetOrbitProperties[]
  position: [number, number]
  bpm: 30
}

const style = {
  fill: 'white',
  stroke: 'black',
  opacity: 1.0,
  size: 1.0,
  strokeWidth: 1.0
}

class PlanetSystem extends CanvasElement {

  readonly MAX_ORBITS = 5

  state : PlanetSystemState = {
    time: 0,
    selected : false
  }

  props : PlanetSystemProperties = null

  schedulers : TriggerScheduler[] = []

  orbits : PlanetOrbit[] = []

  constructor(props : PlanetSystemProperties, parent : CanvasElement = null) {
    super({parent : parent})
    this.props = props

    this.position = props.position
    this.scale = 0.1

    this.schedulers = _.range(this.MAX_ORBITS).map( () => new TriggerScheduler({ triggerCallback : (...args) => {
      console.log(args)
    }}))

    this.orbits = this.props.orbits.map((p) => new PlanetOrbit(p, this))
  }

  handleMouseEvent(event: CanvasMouseEvent) {
    if (event.type == 'click') {
      // hit = hitTest()
    }
    
  }

  update(time : number) {
    const { orbits, bpm } = this.props
    this.state.time = time;

    orbits.forEach( (orbit,i) => {
      const orbitalPeriod = orbit.speed * 240 / bpm * 1000
      this.schedulers[i].checkTriggers(orbit, time, orbitalPeriod)
    })
  }

  render(stage : Stage) {
    const context = stage.context
    const { size, fill, opacity, stroke, strokeWidth } = style
    const { time } = this.state
    const transform = this.transformMatrix

    context.setTransform(toDOMMatrix(transform))

    context.lineWidth = strokeWidth / this.absoluteScale
    context.fillStyle = fill
    context.strokeStyle = stroke
    context.globalAlpha = opacity

    context.beginPath()
    context.arc(0, 0, size, 0, 2*Math.PI)
    context.closePath()
    context.fill()
    context.stroke()
    
    this.orbits.forEach( (orbit,i) => orbit.render(stage,size + (i+1)))
  }

}

export { PlanetSystem, PlanetSystemProperties }