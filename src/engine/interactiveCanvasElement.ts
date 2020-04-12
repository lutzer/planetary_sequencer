import { CanvasElement } from "./canvasElement"
import { multiply, matrix, inv }  from "mathjs"

class InteractiveCanvasElement extends CanvasElement {

  propagateEvents : boolean = true
  ignoreEvents : boolean = false

  constructor(
    {x, y, scale = 1.0, propagateEvents = true, ignoreEvents = false } : 
    {x : number, y : number, scale?: number, propagateEvents? : boolean, ignoreEvents? : boolean}) {
    super({x,y,scale})

    this.propagateEvents = propagateEvents
    this.ignoreEvents = ignoreEvents
  }

  handleEvent(event : string, pos : [number, number]) {

    if (!this.ignoreEvents) {
      // transform coordinates to local system
      const tpos = multiply( inv(this.transformMatrix), matrix([pos[0], pos[1], 1]))
      // check if its inside bounding box
      if (this.isPointInside(<number[]>tpos.toArray())) {
          this.onEvent(event)
      }
    }

    if (this.propagateEvents) {
      // propagate event to children
      this.children.forEach( (child) => {
        if (child instanceof InteractiveCanvasElement)
          child.handleEvent(event, pos)
      })
    }
  }

  onEvent(event : string) {}

  isPointInside(pos : number[]) : boolean {
    return false
  } 
}

export { InteractiveCanvasElement }