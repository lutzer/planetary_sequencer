import { NotePlanet } from "./notePlanets";
import _ from "lodash";
import { Stage } from "../engine/stage";
import { BaseCanvasElement } from "./baseElements";
import { euclidianDistance } from "../engine/utils";

class Orbit extends BaseCanvasElement {

  props : any = {
    ...this.props,
    distance: 0,
    steps: 0,
    stroke: 'black',
    opacity : 1.0
  }

  constructor({distance, steps} : {distance: number, steps : number}) {
    super({x:0, y:0, scale:1})
    Object.assign(this.props, {distance, steps})
  }

  addChild(planet : NotePlanet) {
    super.addChild(planet)
  }

  get planets() : NotePlanet[] {
    return <NotePlanet[]>this.children
  }

  update(time: number, bpm: number) {
    const { distance } = this.props

    const orbitalPeriod = distance * 240 / bpm * 1000
    const orbitalSpeed = Math.PI * 2 / orbitalPeriod

    const angle = (time * orbitalSpeed) % (Math.PI*2) - Math.PI/2

    this.planets.forEach( (planet) => {
      planet.update(angle, distance)
    })

    this.checkTriggers()
  }

  checkTriggers() {
    // todo
  }

  isPointInside(pos : [number, number]) : boolean {
    const { size, distance } =  this.props
    const dist = euclidianDistance(pos, this.position)
    return dist > (distance - 0.4) && dist < (distance + 0.4)
  }

  draw(stage : Stage) {
    super.draw(stage)
    const { stroke, strokeWidth, distance, opacity } = this.props
    const context = stage.renderer
    
    context.lineWidth = strokeWidth*this.scale
    context.globalAlpha = opacity
    context.strokeStyle = stroke
    context.beginPath()
    context.arc(this.x, this.y, distance * this.scale, 0, 2*Math.PI)
    context.closePath()
    context.stroke()
  }
}

export { Orbit }