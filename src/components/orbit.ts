import _ from "lodash";
import { Stage } from "../engine/stage";
import { BaseCanvasElement } from "./baseElements";
import { snapTo } from "../engine/utils";
import { InstrumentPlanet, InstrumentMode } from "./instrumentPlanets";
import { NotePlanet } from "./notePlanets";
import { CanvasMouseEvent, CanvasMouseButton } from "../engine/mouseEvents";
import { TriggerScheduler } from "./triggerScheduler";

class Orbit extends BaseCanvasElement {

  props : any = {
    ...this.props,
    distance: 0,
    speed : 1,
    steps: 0,
    stroke: 'black',
    opacity : 1.0,
    snap : true
  }

  angle : number = 0

  scheduler : TriggerScheduler = null

  constructor({speed, distance = 0, steps, snap = true} : { speed : number, steps : number, distance?: number, snap? : boolean}) {
    super({x:0, y:0, scale:1})
    Object.assign(this.props, {distance, steps, snap, speed})

    this.handleEventTypes = ['click']
    this.scheduler = new TriggerScheduler({ interval: 100, triggerCallback : (planet, time) => {
      planet.triggerPulse(time)
    }})
  }

  addChild(planet : NotePlanet) {
    super.addChild(planet)
  }

  get planets() : NotePlanet[] {
    return <NotePlanet[]>this.children
  }

  get instrument() : InstrumentPlanet {
    return <InstrumentPlanet>this.parent
  }

  update(time: number, bpm: number) {
    const { distance, speed } = this.props

    const orbitalPeriod = speed * 240 / bpm * 1000
    const orbitalSpeed = Math.PI * 2 / orbitalPeriod

    this.angle = (time * orbitalSpeed) % (Math.PI*2)

    this.planets.forEach( (planet) => {
      planet.update(time, this.instrument.getMode() == InstrumentMode.PLAYING ? this.angle : 0, distance)
    })

    this.scheduler.checkTriggers(this.planets, time, orbitalPeriod)
  }

  isPointInside(pos : [number, number]) : boolean {
    const { distance } = this.props
    const dist = Math.sqrt(pos[0]*pos[0] + pos[1]*pos[1])
    return dist > distance - 0.5 && dist < distance + 0.5
  }

  onMouseEvent(event : CanvasMouseEvent) : boolean {
    const { snap, steps } = this.props
    if (event.type == 'click' && this.isPointInside(event.pos)) {
      if (event.button == CanvasMouseButton.LEFT ) {
        const phase = Math.atan2(event.pos[1]+this.y, event.pos[0]+this.x) / Math.PI / 2
        this.addChild(new NotePlanet({ octave: 5, note: 'C', phase: snap ? snapTo(phase, steps) : phase }))
      }
      return true
    }
    return false
  }

  draw(stage : Stage) {
    const { stroke, strokeWidth, distance, opacity } = this.props
    super.draw(stage)
    const context = stage.renderer

    context.lineWidth = strokeWidth*this.scale
    context.globalAlpha = opacity
    context.strokeStyle = stroke
  
    if (this.instrument.getMode() == InstrumentMode.SETUP) {
      context.beginPath()
      context.arc(this.x, this.y, distance * this.scale, 0, 2*Math.PI)
      context.closePath()
      context.stroke()

      this.drawSteps(stage)
      this.drawAngle(stage)
    } else {
      this.drawConnections(stage)
    }
  }

  drawConnections(stage : Stage) {
    const { stroke, opacity, strokeWidth } = this.props
    const context = stage.renderer

    context.globalAlpha = 0.4

    this.children.forEach( (child : NotePlanet) => {
      context.beginPath()
      context.moveTo(Math.cos(child.currentAngle) * this.instrument.diameter, Math.sin(child.currentAngle) * this.instrument.diameter)
      context.lineTo(child.x, child.y);
      context.closePath()
      context.stroke()
    }) 
  }

  drawAngle(stage : Stage) {
    const context = stage.renderer
    const { distance } = this.props

    const offset = 0.2
    const p1 = [ Math.cos(-this.angle) * (distance - offset), Math.sin(-this.angle) * (distance - offset) ]
    const p2 = [ Math.cos(-this.angle) * (distance + offset), Math.sin(-this.angle) * (distance + offset) ]
    const p3 = [ Math.cos(-this.angle - offset/distance) * (distance), Math.sin(-this.angle - offset/distance) * (distance) ]

    context.fillStyle = 'white'
    context.beginPath()
    context.moveTo(p1[0],p1[1])
    context.lineTo(p2[0],p2[1])
    context.lineTo(p3[0],p3[1])
    context.closePath()
    context.fill()
    context.stroke()
  }

  drawSteps(stage : Stage) {
    const context = stage.renderer
    const { distance, steps } = this.props

    context.fillStyle = 'white'

    _.range(steps).forEach( (val) => {
      const angle = val/steps * 2 * Math.PI
      const p = [ Math.cos(angle) * distance, Math.sin(angle) * distance ]
      context.beginPath()
      context.arc(p[0], p[1], 0.1, 0, 2*Math.PI)
      context.closePath()
      context.fill()
      context.stroke()
    })
  }
}

export { Orbit }