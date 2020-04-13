import { Stage } from '../engine/stage'
import _ from 'lodash'
import { InteractiveCanvasElement } from '../engine/interactiveCanvasElement'
import { euclidianDistance } from '../engine/utils'

class BaseCanvasElement extends InteractiveCanvasElement {

  protected props : any = {
    size : 1.0, 
    fill : 'white',
    stroke : 'black',
    strokeWidth: 0.02,
    opacity : 1.0,
  }

  selected : boolean = false

  constructor({x, y, scale = 1.0, ...props} : any ) {
    super({x,y,scale})
    Object.assign(this.props, props)
  }
}

class BasePlanet extends BaseCanvasElement {

  protected props : any = {
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

export { BasePlanet, BaseCanvasElement }