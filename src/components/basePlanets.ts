import { CanvasElement } from '../engine/canvasElement'
import { Stage } from '../engine/stage'
import { toDOMMatrix } from '../engine/utils'
import _ from 'lodash'

function angularSum(angle1 : number, angle2: number ) {
  return ((angle1 + angle2) + (2*Math.PI)) % (Math.PI * 2)
}

enum DrawingMode {
  PLAYING, SETUP
}

class PlanetCanvasElement extends CanvasElement {

  readonly STYLE = {
    margin : 0.01,
    stepsLineLength : 0.91
  }

  protected props : any = {
    size : 1.0, 
    fill : 'white',
    stroke : 'black',
    opacity : 1.0,
  }

  constructor(
    {x,y,scale = 1.0} : { x: number, y: number, scale? : number }, props? : object ) {
    super({x,y,scale})

    Object.assign(this.props, props)
  }

  draw(stage : Stage, mode : DrawingMode = DrawingMode.PLAYING) {
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

    this.children.forEach( (child : PlanetCanvasElement) => {
      context.globalAlpha = opacity
      context.strokeStyle = stroke
      context.beginPath()
      context.moveTo(0, 0)
      context.lineTo(child.x, child.y);
      context.closePath()
      context.stroke()
    }) 

    this.children.forEach( (child : PlanetCanvasElement) => {
      child.drawConnections(stage, opacity)
    })
  }
}

class BasePlanet extends PlanetCanvasElement {

  protected props : any = {
    ...this.props,
    distance : 0, 
    phase: 0,
    mass : 1.0
  }

  protected phaseRad : number = 0.0 

  protected bpm : number

  protected orbitalPeriod : number
  protected orbitalSpeed : number

  protected drawDistance : number = 0

  constructor(
    {x,y,scale = 1.0} : { x: number, y: number, scale? : number }, 
    props : any = {} ) {
      super({x,y, scale}, props)

      Object.assign(this.props, props)

      this.phaseRad = this.props.phase * Math.PI * 2
      this.drawDistance = Math.log(1+this.props.distance)/Math.log(2) * this.props.mass
  }

  private updateBpm(bpm : number) {
    const { distance } = this.props
    this.bpm = bpm
    this.orbitalPeriod = distance * 240 / bpm * 1000
    this.orbitalSpeed = Math.PI * 2 / this.orbitalPeriod
  }

  update(time: number, bpm: number) {
    const { distance } = this.props
    
    if (bpm != this.bpm)
      this.updateBpm(bpm)

    // const angularSpeed = this.bpm / 60 * Math.PI/2
    const angle = (this.phaseRad + time * this.orbitalSpeed) % (Math.PI*2) - Math.PI/2

    // update angle & position
    if (distance > 0) {
      this.position = [ Math.cos(angle) * this.drawDistance, Math.sin(angle) * this.drawDistance ]
    }

    //update children
    this.children.forEach( (child : BasePlanet) => {
      child.update(time, bpm)
    })
  }
}

interface TriggerCallbackHandler {
  (planet : BaseTriggerPlanet, atTime : number, step: number) : void
}

class BaseTriggerPlanet extends BasePlanet {

  readonly SCHEDULE_INTERVAL = 100 // in ms
  readonly SCHEDULE_AHEAD = 150 // in ms

  readonly PULSE_SIZE = 1.3
  readonly PULSE_DURATION = 300

  private pulse = 0.0

  private lastScheduleCheckTime = 0
  private scheduledTriggers : number[] = []

  protected props : any = {
    ...this.props,
    steps: 1
  }

  triggerCallback : TriggerCallbackHandler = () => {}

  constructor({x,y,scale = 1.0} : { x: number, y: number, scale? : number }, props : any = {} ) {
    super({x,y,scale}, props)

    Object.assign(this.props, props)
  }

  update(time : number, bpm : number) {
    super.update(time, bpm)
    this.scheduleTriggers(time)

    if (!_.isEmpty(this.scheduledTriggers)) {
      const pulseTime = (time - this.scheduledTriggers[0])
      this.pulse = pulseTime > 0 && pulseTime < this.PULSE_DURATION ? (this.PULSE_DURATION-pulseTime) / this.PULSE_DURATION : 0
    } else
      this.pulse = 0.0
    
  }

  scheduleTriggers(time : number) {
    const { phase, steps } = this.props

    // only check in a defined interval for new triggers
    if (time - this.lastScheduleCheckTime < this.SCHEDULE_INTERVAL)
      return
    this.lastScheduleCheckTime = time

    // remove passed steps from schedule array
    this.scheduledTriggers = this.scheduledTriggers.filter( (val) => val + this.PULSE_DURATION  > time)

    const startOfPeriod = time - ( time % this.orbitalPeriod)

    // calculate trigger times for steps
    const nextTriggers = _.range(steps).map( (step) => {
      let nextSteptrigger = startOfPeriod + (step/steps - (phase)) * this.orbitalPeriod
      while (nextSteptrigger < time)
        nextSteptrigger += this.orbitalPeriod 
      return nextSteptrigger
    })

    // schedule triggers, when inside schedule window
    nextTriggers.forEach( (triggerTime, i) => {
      if (triggerTime - time < this.SCHEDULE_AHEAD && !this.scheduledTriggers.includes(triggerTime)) {
        this.scheduledTriggers.push(triggerTime)
        this.triggerCallback(this,triggerTime,i)
      }
    })
  }

  draw(stage : Stage) {
    super.draw(stage)
    this.drawTrigger(stage)
  }

  drawTrigger(stage : Stage) {
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

export { BasePlanet, BaseTriggerPlanet, BaseModulationPlanet, TriggerCallbackHandler }