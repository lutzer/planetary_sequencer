import { CanvasElement } from "../engine/canvasElement"
import { Stage } from "../engine/stage"
import { toDOMMatrix } from "../engine/utils"

class Circle extends CanvasElement {
  radius : number

  constructor({x, y, radius} : {x: number, y: number, radius: number}) {
    super({x,y})
    this.radius = radius
  }

  draw(stage : Stage) {
    super.draw(stage)
    var context = stage.renderer

    context.fillStyle = 'green'
    context.strokeStyle = 'black'
    context.lineWidth = 2/stage.width
    context.beginPath()
    context.arc(this.x, this.y, this.radius * this.scale, 0, 2*Math.PI)
    context.closePath()
    context.fill()
    context.stroke()
  }
}

export { Circle }