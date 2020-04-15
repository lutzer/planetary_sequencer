import { NoteTrigger } from '../sound/note'
import { BasePlanet } from './baseElements'
import { Stage } from '../engine/stage'
import { Orbit } from './orbit'
import _ from 'lodash'
import { CanvasMouseEvent, CanvasMouseButton } from '../engine/canvasMouse'

interface NoteTriggerCallbackHandler {
  (sound : NoteTrigger, atTime: number) : void
}

enum InstrumentMode {
  PLAYING, SETUP
}

class InstrumentPlanet extends BasePlanet {

  noteTriggerCallback : NoteTriggerCallbackHandler

  protected channel : number
  private mode : InstrumentMode

  bpm : number

  constructor(
    {bpm = 30, channel = null, scale = 1.0, noteTriggerCallback = () => {}} : 
    {bpm : number, channel? : number, scale? : number, noteTriggerCallback? : NoteTriggerCallbackHandler }) {
      super({scale})

      this.channel = channel

      this.handleEventTypes = ['click']
      this.noteTriggerCallback = noteTriggerCallback
      this.setSelected(false)
      this.bpm = 30
  }

  setSelected(select : boolean) {
    super.setSelected(select)
    this.mode = select ? InstrumentMode.SETUP : InstrumentMode.PLAYING
    this.propagateEvents = select
  }

  getMode() : InstrumentMode {
    return this.mode
  }

  onMouseEvent(event : CanvasMouseEvent) {
    if (event.type == 'click' && this.isPointInside(event.pos)) {
      if (event.button == CanvasMouseButton.LEFT)
        this.setSelected(!this.selected)
      return true
    }
    return false
  }

  addChild(orbit : Orbit) : Orbit {
    super.addChild(orbit)
    this.updateOrbits()
    return orbit
  }

  updateOrbits() {
    this.children = _.sortBy(this.orbits, (orbit) => orbit.props.speed)
    this.orbits.forEach( (orbit, index) => {
      orbit.props.distance = 3 + index*2
    })
  }

  get orbits() : Orbit[] {
    return <Orbit[]>this.children;
  }

  update(time: number) {
    this.orbits.forEach( (orbit : Orbit) => {
      orbit.update(time, this.bpm)
    })
  }

  draw(stage : Stage) {
    if (this.mode == InstrumentMode.PLAYING) {
      this.drawStepLine(stage)
      this.props.fill = '#ffffff'
    } else {
      this.props.fill = '#000000'
    }
    super.draw(stage)
    
  }

  drawStepLine(stage : Stage) {
    const { stroke, size, strokeWidth } = this.props
    const context = stage.renderer
    context.globalAlpha = 0.1
    context.strokeStyle = stroke
    context.lineWidth = strokeWidth * this.scale

    context.beginPath()
    context.moveTo(size * 1.2 * this.scale,0)
    context.lineTo(1,0)
    context.closePath()
    context.stroke()
  }
}

export { InstrumentPlanet, InstrumentMode, NoteTriggerCallbackHandler }