import { CanvasElement } from "./canvasElement";
import _ from "lodash";

class CanvasGroup {
  
  children : CanvasElement[] = []

  constructor() {

  }

  addChildren(children : CanvasElement[]) {
    children.forEach( (child) => {
      this.addChild(child)
    })
  }

  addChild(child : CanvasElement) : CanvasElement {
    this.children.push(child)
    return child
  }

  removeChild(child : CanvasElement) : CanvasElement {
    var removed = _.remove(this.children, child)
    return _.isEmpty(removed) ? null : removed[0]
  }

  clear() {
    this.children = []
  }

}

export { CanvasGroup }