import { Stage } from './stage'
import { matrix, multiply, Matrix, inv } from 'mathjs'
import { toDOMMatrix } from './utils'
import _ from 'lodash'
import { CanvasGroup } from './canvasGroup'

class CanvasElement extends CanvasGroup {

  position : [number, number]
  children : CanvasElement[] = []
  parent: CanvasElement = null
  scale : number = 1
  rotation : number = 0

  constructor({x, y, scale = 1.0, rotation = 0} : {x : number, y : number, scale?: number, rotation? : number}) {
    super()
    this.position = [x,y]
    this.scale = scale
    this.rotation = rotation
  }

  addChild(child : CanvasElement) {
    child.parent = this
    super.addChild(child)
  }

  get transformMatrix() : Matrix {
    var transform = matrix([
      [ this.scale, 0, this.position[0] ],
      [ 0, this.scale, this.position[1] ],
      [ 0, 0, 1 ]
    ])
    if (this.rotation != 0) {
      const rotation =  matrix([
        [ Math.cos(this.rotation), -Math.sin(this.rotation), 0 ],
        [ Math.sin(this.rotation), Math.cos(this.rotation), 0 ],
        [ 0, 0, 1 ]
      ])
      transform = multiply( transform, rotation)
    }
    if (!this.parent)
      return transform
    else
      return multiply( this.parent.transformMatrix, transform)   
  }

  get x() : number {
    return this.position[0]
  }
  set x(val: number) {
    this.position[0] = val
  }
  get y() : number {
    return this.position[1]
  }
  set y(val: number) {
    this.position[1] = val
  }

  render(stage: Stage) {
    this.beforeDraw(stage)
    this.draw(stage)
    this.afterDraw(stage)
  }

  protected beforeDraw(stage : Stage) {
    if (this.parent)
      stage.renderer.setTransform(toDOMMatrix(this.parent.transformMatrix))
    else
      stage.renderer.resetTransform()
  }

  draw(stage : Stage) {}

  protected afterDraw(stage : Stage) {
    this.children.forEach( (child) => {
      child.render(stage)
    })
  }
}

export { CanvasElement }