import { CanvasElement } from "../engine/canvasElement"
import { Stage } from "../engine/stage"
import { toDOMMatrix } from "../engine/utils"
import { Note } from "../sound/note"

type NotePlanetProperties = {
  note: number,
  octave: number,
  phase: number, 
  gate: number
}

const style = {
  fill: 'white',
  stroke: 'black',
  text: 'gray',
  opacity: 1.0,
  strokeWidth: 1.0
}

class NotePlanet extends CanvasElement {

  props : NotePlanetProperties

  constructor(props: NotePlanetProperties, parent: CanvasElement) {
    super({parent: parent})
    this.props = props
  }

  render(stage: Stage, distance = 0.0) {
    const context = stage.context
    const { fill, opacity, stroke, strokeWidth, text } = style
    const { phase, octave, note } = this.props
    const phaseRad = phase * Math.PI*2
    this.position = [Math.cos(phaseRad) * distance, Math.sin(phaseRad) * distance]
    
    const size = 0.1 + octave * 0.05
    const transform = this.transformMatrix
    context.setTransform(toDOMMatrix(transform))

    context.lineWidth = strokeWidth / this.absoluteScale
    context.fillStyle = fill
    context.strokeStyle = stroke
    context.globalAlpha = opacity

    context.beginPath()
    context.arc(0, 0, size, 0, 2*Math.PI)
    context.closePath()
    context.fill()
    context.stroke()

    context.resetTransform()
    const textPos = this.absolutePosition
    context.fillStyle = text
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    context.fillText(Note.fromInt(note), textPos[0], textPos[1])
  }
}


export { NotePlanetProperties, NotePlanet }