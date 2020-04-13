import { CanvasElement } from "./canvasElement"
import { multiply, matrix, inv, Matrix }  from "mathjs"
import { CanvasMouseEvent } from "./mouseEvents"

function matrixToPointArray(mat : Matrix) : [number, number] {
  return <[number, number]>(<number[]>mat.toArray()).slice(0,2)
}

class InteractiveCanvasElement extends CanvasElement {

  propagateEvents : boolean = true
  handleEventTypes : string[] = []

  constructor(
    {x, y, scale = 1.0, rotation = 0, propagateEvents = true, handleEventTypes = [] } : 
    {x : number, y : number, scale?: number, rotation? : number, propagateEvents? : boolean, handleEventTypes? : string[]}) {
    super({x,y,scale,rotation})

    this.propagateEvents = propagateEvents
    this.handleEventTypes = handleEventTypes
  }

  handleMouseEvent(event : CanvasMouseEvent) : boolean {
    // first check children
    if (this.propagateEvents) {
      // propagate event to children
      for (const child of this.children) {
        if (child instanceof InteractiveCanvasElement) {
          const handled = child.handleMouseEvent(event)
          if (handled) return true
        }
      }
    }

    // then check self
    if (this.handleEventTypes.includes(event.type)) {
        const tmap = multiply( inv(this.transformMatrix), matrix([event.pos[0], event.pos[1], 1]))
        const tpos = matrixToPointArray(tmap)
        const handled = this.onMouseEvent({ type: event.type, pos: tpos, button: event.button})
        if (handled) return true
    }
    return false
  }

  // return true if event got handled
  onMouseEvent(event : CanvasMouseEvent) : boolean {
    return false
  }

  isPointInside(pos : number[]) : boolean {
    return false
  } 
}

export { InteractiveCanvasElement }