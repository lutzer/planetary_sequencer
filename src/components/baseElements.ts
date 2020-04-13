import { Stage } from '../engine/stage'
import _ from 'lodash'
import { InteractiveCanvasElement } from '../engine/interactiveCanvasElement'
import { euclidianDistance } from '../engine/utils'

class BaseCanvasElement extends InteractiveCanvasElement {

  props : any = {
    size : 1.0, 
    fill : 'white',
    stroke : 'black',
    strokeWidth: 0.02,
    opacity : 1.0,
  }

  protected selected : boolean = false

  constructor({x, y, scale = 1.0, ...props} : any ) {
    super({x,y,scale})
    Object.assign(this.props, props)
  }

  setSelected(select : boolean) {
    this.selected = select
  }
}

class BasePlanet extends BaseCanvasElement {

  props : any = {
    ...this.props,
    phase: 0
  }

  constructor({ scale = 1.0, size = 1.0, ...props} : any) {
      super({x: 0,y: 0, scale: scale, ...props})
      Object.assign(this.props, props, {size})
  }

  get diameter() : number {
    return this.props.size
  }

  isPointInside(pos : [number, number]) : boolean {
    const { size } =  this.props
    const dist = Math.sqrt(pos[0]*pos[0]+pos[1]*pos[1])
    return dist < size
  }

  draw(stage : Stage) {
    super.draw(stage)
    const context = stage.renderer
    const { fill, stroke, strokeWidth, size, opacity } = this.props

    context.lineWidth = strokeWidth * this.scale
    context.fillStyle = fill
    context.strokeStyle = stroke
    context.globalAlpha = opacity
    context.beginPath()
    context.arc(this.x, this.y, size * this.scale, 0, 2*Math.PI)
    context.closePath()
    context.fill()
    context.stroke()
  }
}

class PlanetPulse {

  readonly PULSE_SIZE = 1.3
  readonly PULSE_DURATION = 300

  pulse = 0.0
  planet : BasePlanet = null

  pulseAtTime = 0.0

  constructor(planet : BasePlanet, duration : number = 100) {
    this.planet = planet
  }

  trigger(atTime: number) {
    this.pulseAtTime = atTime
  }

  update(time: number) {
    if (this.pulseAtTime > 0) {
      const pulseTime = (time - this.pulseAtTime)
      this.pulse = pulseTime > 0 && pulseTime < this.PULSE_DURATION ? (this.PULSE_DURATION-pulseTime) / this.PULSE_DURATION : 0
    } else
      this.pulse = 0.0
  }

  draw(stage : Stage) {
    if (this.pulse <= 0)
      return

    const { size, stroke } = this.planet.props
    const context = stage.renderer

    context.globalAlpha = this.pulse
    context.strokeStyle = stroke
    context.beginPath()
    context.arc(this.planet.x, this.planet.y, (1+this.PULSE_SIZE - this.pulse) * size * this.planet.scale, 0, 2*Math.PI);
    context.closePath()
    context.stroke()
  }
}

export { BasePlanet, BaseCanvasElement, PlanetPulse }