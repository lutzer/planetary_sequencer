import { CanvasElement } from '../engine/canvasElement'
import { Stage } from '../engine/stage'
import _ from 'lodash'

class BaseCanvasElement extends CanvasElement {

  protected props : any = {
    size : 1.0, 
    fill : 'white',
    stroke : 'black',
    opacity : 1.0,
  }

  constructor( {x, y , scale = 1.0, ...props} : any ) {
    super({x,y,scale})
    Object.assign(this.props, props)
  }
}

class BasePlanet extends BaseCanvasElement {

  protected props : any = {
    ...this.props,
    phase: 0
  }

  constructor({ scale = 1.0, ...props} : any) {
      super({x: 0,y: 0, scale: scale, ...props})
      Object.assign(this.props, props)
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
}

export { BasePlanet, BaseCanvasElement }