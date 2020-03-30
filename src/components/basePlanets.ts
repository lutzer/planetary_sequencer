import { CanvasElement } from '../engine/canvasElement'
import { Stage } from '../engine/stage'
import { toDOMMatrix } from '../engine/utils'
import _ from 'lodash'

function angularSum(angle1 : number, angle2: number ) {
  return (angle1 + angle2) % (Math.PI * 2)
}

interface TriggerCallbackHandler {
  (planet : BasePlanet, step : number) : void
}


class BasePlanet extends CanvasElement {

  readonly PULSE_SIZE = 1.5
  readonly PULSE_SPEED = 7

  readonly style = {
    margin : 0.1,
    stepsLineLength : 0.8
  }

  options : {
    size : number
    distance : number
    fill : string
    stroke : string
    phase: number
    opacity: number
    mass: number
    steps : number
    triggerCallback : TriggerCallbackHandler
  } = {
    size : 1.0, 
    distance : 0, 
    fill : 'white',
    stroke : 'black',
    phase: 0,
    opacity : 1.0,
    mass : 1.0,
    steps : 0,
    triggerCallback: () => {}
  }

  angle : number = 0.0
  pulse : number = 0.0

  constructor({x,y,scale = 1.0} : { x: number, y: number, scale? : number }, options? : object) {
    super({x,y, scale})
    Object.assign(this.options, options)

    this.reset()
  }

  addChild(planet : BasePlanet) {
    super.addChild(planet)
    planet.options.triggerCallback = (planet, step) => this.onChildTriggered(planet, step)
  }

  onChildTriggered(child : BasePlanet, step: number) {}

  onTriggered(step : number) {
    this.options.triggerCallback(this, step)
    this.pulse = this.PULSE_SIZE
  }

  reset() {
    this.angle = this.options.phase * Math.PI*2
  }

  update(dt: number, bpm: number) {
    const { distance, mass, steps } = this.options
    const previousAngle = this.angle

    const radPerSecond = bpm / 60 * Math.PI/2

    // update angle & position
    if (distance > 0) {
      const drawDist = mass * Math.log(1+distance)/Math.log(2)
      this.angle = (this.angle + dt * radPerSecond/distance) % (Math.PI*2)
      this.position = [ Math.cos(this.angle) * drawDist, Math.sin(this.angle) * drawDist ]
    }

    // check if step got triggered
    if (steps > 0) {
      const prevDist = ((angularSum(previousAngle,Math.PI/2) / Math.PI / 2) * steps) % 1
      const newDist = ((angularSum(this.angle, Math.PI/2) / Math.PI / 2) * steps) % 1
      if (newDist < prevDist) {
        this.onTriggered(Math.floor((angularSum(this.angle, Math.PI/2) / Math.PI / 2) * steps))
      }
    }

    this.pulse = Math.max(0, this.pulse - dt * this.PULSE_SPEED)

    //update childrens positions
    this.children.forEach( (child : BasePlanet) => {
      child.update(dt, bpm)
    })
  }

  draw(stage : Stage) {
    super.draw(stage)
    const context = stage.renderer
    const { fill, stroke, size, opacity } = this.options

    context.fillStyle = fill
    context.strokeStyle = stroke
    context.globalAlpha = opacity
    context.beginPath()
    context.arc(this.x, this.y, size * this.scale, 0, 2*Math.PI)
    context.closePath()
    context.fill()
    context.stroke()

    if (this.pulse>0) {
      this.drawPulse(stage)
    }
  }

  drawPulse(stage : Stage) {
    const { size, stroke } = this.options
    const context = stage.renderer

    context.globalAlpha = this.pulse
    context.strokeStyle = stroke
    context.beginPath()
    context.arc(this.x, this.y, (1+this.PULSE_SIZE - this.pulse) * size * this.scale, 0, 2*Math.PI);
    context.closePath()
    context.stroke()
  }

  drawConnections(stage : Stage, opacity = 1.0) {
    const { stroke } = this.options
    const context = stage.renderer
    
    if(this.parent)
      context.setTransform(toDOMMatrix(this.transformMatrix))

    this.children.forEach( (child : BasePlanet) => {
      context.globalAlpha = opacity
      context.strokeStyle = stroke
      context.beginPath()
      context.moveTo(0, 0)
      context.lineTo(child.x, child.y);
      context.closePath()
      context.stroke()
    }) 

    this.children.forEach( (child : BasePlanet) => {
      child.drawConnections(stage, opacity)
    })
  }
}

class BaseModulationPlanet extends BasePlanet {
  constructor({ distance, steps, phase} : { distance: number, steps: number, phase: number }) {
    super({x: 0,y: 0}, {steps, distance, phase, mass: 0.25, size: 0.02, fill: '#ff0000'})
  }
}

export { BasePlanet, BaseModulationPlanet, TriggerCallbackHandler }