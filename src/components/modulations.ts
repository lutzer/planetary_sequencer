import { CanvasElement } from "../engine/canvasElement";
import { Stage } from "../engine/stage";
import { toDOMMatrix } from "../engine/utils";

type ModulationType = 'transpose'

type ModulationProperties = {
  speed: number,
  type: ModulationType,
  interpolate: boolean,
  steps: { phase: number, val: number}[]
}

const style = {
  stroke: 'black',
  opacity: 0.2,
  strokeWidth: 10.0
}

const strokeColors = ['red','green','blue']

class Modulation extends CanvasElement {

  props: ModulationProperties

  constructor(props : ModulationProperties, parent : CanvasElement) {
    super({ parent : parent})
    this.props = props
  }

  render(stage: Stage, orbitRadius: number) {
    const context = stage.context
    const { speed, steps } = this.props
    const { opacity, stroke, strokeWidth } = style
    const transform = this.transformMatrix

    context.setTransform(toDOMMatrix(transform))

    context.lineWidth = strokeWidth / this.absoluteScale
    context.globalAlpha = opacity

    // draw orbit circle
    steps.reduceRight( (prev : number, step, i) => {
      if (prev == null)
        prev = steps[0].phase * Math.PI * 2

      let angle = step.phase * Math.PI * 2
      context.strokeStyle = strokeColors[i%strokeColors.length]
      context.beginPath()
      context.arc(0, 0, 0.3, angle, prev)
      context.stroke()
      context.closePath()
      return angle
    },null)
  }
}

export { ModulationProperties, Modulation, ModulationType }