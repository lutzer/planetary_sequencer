import { CanvasElement } from "./canvasElement"
import { multiply, matrix, inv, Matrix }  from "mathjs"

function matrixToPointArray(mat : Matrix) : [number, number] {
  return <[number, number]>(<number[]>mat.toArray()).slice(0,2)
}

type CanvasMouseEventTypes = 'click' | 'mousemove' | 'mouseup' | 'mousedown'

type CanvasMouseEvent = {
  type : CanvasMouseEventTypes
  pos : [number, number]
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

  handleMouseEvent(event : CanvasMouseEventTypes, pos : [number, number]) : boolean {

    // first check children
    if (this.propagateEvents) {
      // propagate event to children
      for (const child of this.children) {
        if (child instanceof InteractiveCanvasElement) {
          const handled = child.handleMouseEvent(event, pos)
          if (handled) return true
        }
      }
    }

    // then check self
    if (this.handleEventTypes.includes(event)) {
        const tmap = multiply( inv(this.transformMatrix), matrix([pos[0], pos[1], 1]))
        const tpos = matrixToPointArray(tmap)
        const handled = this.onMouseEvent({ type: event, pos: tpos})
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

export { InteractiveCanvasElement, CanvasMouseEvent, CanvasMouseEventTypes }