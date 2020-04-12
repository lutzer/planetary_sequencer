import _ from "lodash";
import { Stage } from "../engine/stage";
import { BaseCanvasElement } from "./baseElements";
import { euclidianDistance } from "../engine/utils";
import { InstrumentPlanet, InstrumentMode } from "./instrumentPlanets";
import { NotePlanet } from "./notePlanets";

class Orbit extends BaseCanvasElement {

  props : any = {
    ...this.props,
    distance: 0,
    steps: 0,
    stroke: 'black',
    opacity : 1.0,
    snap : true
  }

  angle : number = 0;

  constructor({distance, steps, snap = true} : {distance: number, steps : number, snap? : boolean}) {
    super({x:0, y:0, scale:1})
    Object.assign(this.props, {distance, steps, snap})

    this.handleEventTypes = []
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
    const { distance } = this.props

    
    const orbitalPeriod = distance * 240 / bpm * 1000
    const orbitalSpeed = Math.PI * 2 / orbitalPeriod

    this.angle = (time * orbitalSpeed) % (Math.PI*2) - Math.PI/2

    this.planets.forEach( (planet) => {
      planet.update(this.instrument.getMode() == InstrumentMode.PLAYING ? this.angle : 0, distance)
    })

    this.checkTriggers()
  }

  checkTriggers() {
    // todo
  }

  draw(stage : Stage) {
    super.draw(stage)
    const { stroke, strokeWidth, distance, opacity } = this.props
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

    context.globalAlpha = 0.2

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
    const p1 = [ Math.cos(this.angle) * (distance - offset), Math.sin(this.angle) * (distance - offset) ]
    const p2 = [ Math.cos(this.angle) * (distance + offset), Math.sin(this.angle) * (distance + offset) ]
    const p3 = [ Math.cos(this.angle + offset/distance) * (distance), Math.sin(this.angle + offset/distance) * (distance) ]

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