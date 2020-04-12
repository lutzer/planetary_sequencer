import { CanvasElement } from "./canvasElement"
import { multiply, matrix, inv, Matrix }  from "mathjs"

function matrixToPointArray(mat : Matrix) : [number, number] {
  return <[number, number]>(<number[]>mat.toArray()).slice(0,2)
}

class InteractiveCanvasElement extends CanvasElement {

  propagateEvents : boolean = true
  handleEventTypes : string[] = []

  selected : boolean = false

  constructor(
    {x, y, scale = 1.0, propagateEvents = true, handleEventTypes = ['click'] } : 
    {x : number, y : number, scale?: number, propagateEvents? : boolean, handleEventTypes? : string[]}) {
    super({x,y,scale})

    this.propagateEvents = propagateEvents
    this.handleEventTypes = handleEventTypes
  }

  handleMouseEvent(event : string, pos : [number, number]) {

    if (this.handleEventTypes.includes(event))
      if (event == 'click' || event == 'mousedown') {
        // transform coordinates to local system
        const tmap = multiply( inv(this.transformMatrix), matrix([pos[0], pos[1], 1]))
        const tpos = matrixToPointArray(tmap)
        // check if its inside bounding box
        if (this.isPointInside(tpos))
            this.onMouseEvent(event, tpos)
      } else if (this.selected) {
        const tmap = multiply( inv(this.transformMatrix), matrix([pos[0], pos[1], 1]))
        const tpos = matrixToPointArray(tmap)
        this.onMouseEvent(event, tpos)
      }
      
    // dont propagate when this element was selected
    if (this.propagateEvents) {
      // propagate event to children
      this.children.forEach( (child) => {
        if (child instanceof InteractiveCanvasElement)
          child.handleMouseEvent(event, pos)
      })
    }
  }

  onMouseEvent(event : string, pos : [number, number]) {}

  isPointInside(pos : number[]) : boolean {
    return false
  } 
}

export { InteractiveCanvasElement }