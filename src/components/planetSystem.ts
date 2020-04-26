import { Stage } from "../engine/stage";
import { PlanetOrbitProperties } from "./planetOrbit";
import { CanvasMouseEvent } from "../engine/canvasMouse";
import * as math from "mathjs";
import { toDOMMatrix } from "../engine/utils";
import { TriggerScheduler } from "./triggerScheduler";
import { Observable } from './../models/Observable'
import _ from "lodash";

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
  strokeWidth: 1,
  scale : 10
}

class PlanetSystem {

  readonly MAX_ORBITS = 5

  state : PlanetSystemState = {
    time: 0,
    selected : false
  }

  props : PlanetSystemProperties = null

  scheduler : TriggerScheduler = null

  constructor(props : PlanetSystemProperties) {
    this.props = props

    this.scheduler = new TriggerScheduler({ triggerCallback : (planet, time) => {
      console.log([planet,time])
    }})
  }

  handleMouseEvent(event: CanvasMouseEvent) {
    if (event.type == 'click') {
      // hit = hitTest()
    }
    
  }

  // isPointInside(pos : [number, number]) : boolean {
  //   const { size } =  this.props
  //   const dist = Math.sqrt(pos[0]*pos[0]+pos[1]*pos[1])
  //   return dist < size
  // }

  update(time : number) {
    const { orbits, bpm } = this.props
    this.state.time = time;

    orbits.forEach( (orbit,i) => {
      const orbitalPeriod = orbit.speed * 240 / bpm * 1000
      this.scheduler.checkTriggers(i, orbit.planets, time, orbitalPeriod)
    })
  }

  render(stage : Stage) {

    // const context = stage.context
    // const { size, fill, opacity, stroke, strokeWidth, scale } = style
    // const { time } = this.state
    // const { position } = this.props

    // const transform = math.matrix([
    //   [ scale, 0, position[0]*stage.width ],
    //   [ 0, scale, position[1]*stage.height ],
    //   [ 0, 0, 1 ]
    // ])

    // context.setTransform(toDOMMatrix(transform))

    // context.lineWidth = strokeWidth / scale
    // context.fillStyle = fill
    // context.strokeStyle = stroke
    // context.globalAlpha = opacity
    // context.beginPath()
    // context.arc(0, 0, size * scale, 0, 2*Math.PI)
    // context.closePath()
    // context.fill()
    // context.stroke()
    
  }

}

export { PlanetSystem, PlanetSystemProperties }