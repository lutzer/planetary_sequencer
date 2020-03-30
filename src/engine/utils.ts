import _ from 'lodash'
import { Matrix, reshape } from 'mathjs'

const toDOMMatrix = (mat : Matrix) : DOMMatrixInit => {
  // const matData = mat.valueOff()
  const domMatrix = new DOMMatrix([ 
      mat.get([0,0]), mat.get([1,0]), mat.get([0,1]),
      mat.get([1,1]), mat.get([0,2]), mat.get([1,2])
  ])
  return domMatrix;
}

export { toDOMMatrix }