import { Stage } from './stage'
import { matrix, multiply, Matrix } from 'mathjs'
import { toDOMMatrix } from './utils'

class CanvasElement {

  position : number[]
  size : number[]
  children : CanvasElement[] = []
  parent: CanvasElement = null
  scale : number = 1

  constructor({x, y, scale = 1.0} : {x : number, y : number, scale?: number}) {
    this.position = [x,y]
    this.scale = scale
  }

  get transformMatrix() : Matrix {
    const transform = matrix([
      [ this.scale, 0, this.position[0] ],
      [ 0, this.scale, this.position[1] ],
      [ 0, 0, 1 ]
    ])
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

  addChild(child : CanvasElement) {
    child.parent = this
    this.children.push(child)
  }

  beforeDraw(stage : Stage) {
    if (this.parent)
      stage.renderer.setTransform(toDOMMatrix(this.parent.transformMatrix))
    else
      stage.renderer.resetTransform()
  }

  draw(stage : Stage) {
    this.beforeDraw(stage)
    this.children.forEach( (child) => {
      child.draw(stage)
    })
  }
}

export { CanvasElement }