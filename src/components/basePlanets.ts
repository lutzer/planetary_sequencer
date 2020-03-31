import { CanvasElement } from '../engine/canvasElement'
import { Stage } from '../engine/stage'
import { toDOMMatrix } from '../engine/utils'
import _ from 'lodash'

function angularSum(angle1 : number, angle2: number ) {
  return ((angle1 + angle2) + (2*Math.PI)) % (Math.PI * 2)
}

interface TriggerCallbackHandler {
  (planet : BasePlanet, step : number) : void
}

class BasePlanetElement extends CanvasElement {

  readonly style = {
    margin : 0.01,
    stepsLineLength : 0.91
  }

  props : {
    size : number
    fill : string
    stroke : string
    opacity : number
    distance : number
    phase: number
    mass: number
    steps : number
  } = {
    size : 1.0, 
    fill : 'white',
    stroke : 'black',
    distance : 0, 
    phase: 0,
    opacity : 1.0,
    mass : 1.0,
    steps : 0
  }

  constructor(
    {x,y,scale = 1.0} : { x: number, y: number, scale? : number }, props? : object ) {
    super({x,y,scale})

    // add default properties
    Object.assign(this.props, props)
  }

  update(time: number, bpm: number = 1.0) {
    //update children
    this.children.forEach( (child : BasePlanet) => {
      child.update(time, bpm)
    })
  }

  draw(stage : Stage) {
    super.draw(stage)
    const context = stage.renderer
    const { fill, stroke, size, opacity } = this.props

    context.fillStyle = fill
    context.strokeStyle = stroke
    context.globalAlpha = opacity
    context.beginPath()
    context.arc(this.x, this.y, size * this.scale, 0, 2*Math.PI)
    context.closePath()
    context.fill()
    context.stroke()
  }

  drawConnections(stage : Stage, opacity = 1.0) {
    const { stroke } = this.props
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

class BasePlanet extends BasePlanetElement {

  readonly PULSE_SIZE = 1.3
  readonly PULSE_DURATION = 0.3

  triggerCallback : TriggerCallbackHandler = () => {}

  triggerTime : number = null
  pulse : number = 0.0

  angle : number = 0.0
  phaseRad : number = 0.0 

  stepAngles : number[] = []

  constructor(
    {x,y,scale = 1.0} : { x: number, y: number, scale? : number }, 
    props : object = {} ) {
      super({x,y, scale}, props)

      this.phaseRad = this.props.phase * Math.PI * 2

      this.stepAngles = _.range(0,1.0,1/this.props.steps).map( (val) => angularSum(val * 2 * Math.PI, - 0.5 * Math.PI))
  }

  addChild(planet : BasePlanet) {
    super.addChild(planet)
    planet.triggerCallback = (planet, step) => this.onChildTriggered(planet, step)
  }

  onChildTriggered(child : BasePlanet, step: number) {}

  onTriggered(time: number, step : number) {
    this.triggerCallback(this, step)
    this.triggerTime = time
  }

  update(time: number, bpm: number) {
    const { distance, mass, phase} = this.props
    const previousAngle = this.angle

    const angularSpeed = bpm / 60 * Math.PI/2
    this.angle = (this.phaseRad + time * angularSpeed) % (Math.PI*2)

    // update angle & position
    if (distance > 0) {
      const drawDist = mass * Math.log(1+distance)/Math.log(2)
      this.position = [ Math.cos(this.angle) * drawDist, Math.sin(this.angle) * drawDist ]
    }

    const pulseTime = this.PULSE_DURATION - (time - this.triggerTime)
    this.pulse = pulseTime > 0 ? pulseTime / this.PULSE_DURATION : 0
      
    // check if step got triggered
    var triggered = this.stepAngles.findIndex( (val) => {
      return previousAngle < val && this.angle > val
    })
    if (triggered != -1) {
      this.onTriggered(time, triggered)
    }

    super.update(time, bpm)
  }

  draw(stage: Stage) {
    super.draw(stage)

    this.drawPulse(stage)
  }

  drawPulse(stage : Stage) {
    if (this.pulse <= 0)
      return

    const { size, stroke } = this.props
    const context = stage.renderer

    context.globalAlpha = this.pulse
    context.strokeStyle = stroke
    context.beginPath()
    context.arc(this.x, this.y, (1+this.PULSE_SIZE - this.pulse) * size * this.scale, 0, 2*Math.PI);
    context.closePath()
    context.stroke()
  }

  
}

class BaseModulationPlanet extends BasePlanet {
  constructor({ distance, steps, phase} : { distance: number, steps: number, phase: number }) {
    super({x: 0,y: 0}, {steps, distance, phase, mass: 0.25, size: 0.02, fill: '#aaaaaa'})
  }
}

export { BasePlanet, BaseModulationPlanet, TriggerCallbackHandler }