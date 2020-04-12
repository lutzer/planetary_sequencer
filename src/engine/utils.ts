import _ from 'lodash'
import { Matrix } from 'mathjs'

const toDOMMatrix = (mat : Matrix) : DOMMatrixInit => {
  // const matData = mat.valueOff()
  const domMatrix = new DOMMatrix([ 
      mat.get([0,0]), mat.get([1,0]), mat.get([0,1]),
      mat.get([1,1]), mat.get([0,2]), mat.get([1,2])
  ])
  return domMatrix;
}

const euclidianDistance = (p1 : [number,number], p2 : [number,number]) : number => {
  const diff = [ p2[0] - p1[0], p2[1] - p1[1]]
  return Math.sqrt(diff[0]*diff[0]+diff[1]*diff[1])
}

export { toDOMMatrix, euclidianDistance }