import { Stage } from './stage'
import { matrix, multiply, Matrix } from 'mathjs'
import { toDOMMatrix } from './utils'
import _ from 'lodash'

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

  remove(child : CanvasElement) : CanvasElement {
    var removed = _.remove(this.children, child)
    return _.isEmpty(removed) ? null : removed[0]
  }

  clear() {
    this.children = []
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