import { matrix, multiply, Matrix } from 'mathjs'
import _ from 'lodash'

class CanvasElement {

  private parent: CanvasElement = null
  private transform : Matrix = null

  protected position : [number, number] = [0,0]
  protected scale : number = 1
  protected rotation : number = 0

  constructor({parent = null, x=0, y=0, rotation=0, scale=1} 
    : {parent? : CanvasElement,  x?: number, y?: number, scale?: number, rotation?: number} = {}) 
  {
    this.parent = parent,
    this.position = [x,y]
    this.scale = scale
    this.rotation = rotation
  }

  get transformMatrix() : Matrix {
    let transform = matrix([
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
      this.transform = transform
    else
      this.transform = multiply( this.parent.transformMatrix, transform)
    return this.transform 
  }

  get absoluteScale() : number {
    if (this.parent)
      return this.scale * this.parent.absoluteScale
    else
      return this.scale
  }

  get absolutePosition() : [number, number] {
    let transform = this.transformMatrix
    return [transform.get([0,2]),transform.get([1,2])]
  }

  // get scale() : number {
  //   return this._scale
  // }
  // set scale(scale: number) {
  //   this._scale = scale
  // }  

  // get position() : [number,number] {
  //   return this._position
  // }
  // set position(pos : [number, number]) {
  //   this._position = pos
  // }

  // get rotation() : number {
  //   return this._rotation
  // }
  // set rotation(rot: number) {
  //   this._rotation = rot
  // }
}

export { CanvasElement }