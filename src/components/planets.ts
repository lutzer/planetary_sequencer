// import random = from 'canvas-sketch-util/random';
// const _ = require("lodash")
import { CanvasElement } from './../engine/canvasElement'
import { Stage } from '../engine/stage'
import { toDOMMatrix } from '../engine/utils'
import { InstrumentTypes } from '../sound/types'

const PULSE_SIZE = 1.5 

class BasePlanet extends CanvasElement {

    options : {
      size : number
      distance : number
      fill : string
      stroke : string
      phase: number
    } = {
      size : 1.0, 
      distance : 0, 
      fill : 'white',
      stroke : 'black',
      phase: 0
    }

    angle : number = 0.0
    pulse : number = 0.0

    constructor({x,y} : { x: number, y: number }, options? : object) {
      super({x,y})
      Object.assign(this.options, options)

      this.reset()
    }

    reset() {
      this.angle = this.options.phase * Math.PI*2
    }
  
    update(dt: number, bpm: number) {
      const { distance } = this.options

      const radPerSecond = bpm / 60 * Math.PI/2

      // update angle & position
      if (distance > 0) {
        this.angle = (this.angle + dt * radPerSecond/distance) % (Math.PI*2)
        this.position = [ Math.cos(this.angle) * Math.sqrt(distance), Math.sin(this.angle) * Math.sqrt(distance) ]
      }

      //update childrens positions
      this.children.forEach( (child : BasePlanet) => {
        child.update(dt, bpm)
      })
    }

    draw(stage : Stage) {
      super.draw(stage)
      const context = stage.renderer
      const { fill, stroke, size } = this.options
  
      context.fillStyle = fill
      context.strokeStyle = stroke
      context.globalAlpha = 1.0
      context.beginPath()
      context.arc(this.x, this.y, size, 0, 2*Math.PI)
      context.closePath()
      context.fill()
      context.stroke()

      if (this.pulse>0) {
        context.globalAlpha = this.pulse
        context.beginPath()
        context.arc(this.x, this.y, (1+PULSE_SIZE - this.pulse) * size, 0, 2*Math.PI);
        context.closePath()
        context.stroke()
      }
    }
  
    drawConnections(stage : Stage, opacity = 1.0) {
      const { stroke } = this.options
      const context = stage.renderer
      
      if(this.parent)
        context.setTransform(toDOMMatrix(this.parent.transformMatrix))

      this.children.forEach( (child : BasePlanet) => {
        context.globalAlpha = opacity
        context.strokeStyle = stroke
        context.beginPath()
        context.moveTo(0, 0)
        context.lineTo(child.x, child.y);
        context.closePath()
        context.stroke()

        child.drawConnections(stage)
      }) 
    }
}

class InstrumentPlanet extends BasePlanet {

  constructor({x, y, type, channel = null} : {x:number, y: number, type : InstrumentTypes, channel? : number }) {
    super({x,y}, { type, channel, size: 0.1})
  }
}

class NotePlanet extends BasePlanet {
  constructor({ octave, distance, note, phase = 0.1 } : { octave: number, distance: number, note: string, phase?: number }) {
    super({x: 0,y: 0}, {octave, distance, note, phase, size: 0.05 + octave*0.02, fill: '#eeeeee'})
  }
}

export { BasePlanet, InstrumentPlanet, NotePlanet }