import { fromEvent } from 'rxjs'
import { switchMap, takeUntil } from 'rxjs/operators';
import { Stage } from './stage';

type CanvasMouseEventType = 'click' | 'drag' | 'mouseup' | 'mousedown'

enum CanvasMouseButton {
  LEFT = 1,
  MIDDLE = 2,
  RIGHT = 3
}

type CanvasMouseEvent = {
  type : CanvasMouseEventType
  pos : [number, number]
  button : CanvasMouseButton
  canvasPos : [number, number]
}

interface CanvasMouseHandler {
  (arg : CanvasMouseEvent) : void
}

function canvasToStageEvent(type: CanvasMouseEventType, event: MouseEvent, stage: Stage) : CanvasMouseEvent {
  const x = event.offsetX * stage.scale
  const y = event.offsetY * stage.scale
  return {type: type, pos: [0,0], button: event.which, canvasPos : [x,y] }
}

class CanvasMouse {

  listener : CanvasMouseHandler = () => {}

  constructor(stage : Stage) {
    
    const $mousemove = fromEvent<MouseEvent>(stage.canvas,'mousemove')
    const $mousedown = fromEvent<MouseEvent>(stage.canvas,'mousedown')
    const $mouseup = fromEvent<MouseEvent>(stage.canvas,'mouseup')

    const $drag = $mousedown.pipe( switchMap( 
      () => $mousemove.pipe(takeUntil($mouseup)) 
    ))

    const $click = $mousedown.pipe( switchMap( 
      () => $mouseup.pipe( takeUntil($mousemove) )
    ))

    $drag.subscribe( (event) => {
      this.listener(canvasToStageEvent('drag', event, stage))
    })

    $click.subscribe( (event) => {
      this.listener(canvasToStageEvent('click', event, stage))
    })

    $mousedown.subscribe( (event) => {
      this.listener(canvasToStageEvent('mousedown', event, stage))
    })

    $mouseup.subscribe( (event) => {
      this.listener(canvasToStageEvent('mouseup', event, stage))
    })
  }
}

export { CanvasMouseButton, CanvasMouseEvent, CanvasMouseEventType, CanvasMouse, CanvasMouseHandler  }