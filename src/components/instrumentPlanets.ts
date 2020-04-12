import { InstrumentTypes, SoundTrigger } from '../sound/types'
import { BasePlanet } from './baseElements'
import { Stage } from '../engine/stage'
import { Orbit } from './orbit'

interface NoteTriggerCallbackHandler {
  (sound : SoundTrigger, atTime: number, step : number) : void
}

enum InstrumentMode {
  PLAYING, SETUP
}

class InstrumentPlanet extends BasePlanet {

  soundTriggerCallback : NoteTriggerCallbackHandler

  protected type : InstrumentTypes
  protected channel : number

  private mode : InstrumentMode

  constructor(
    {type, channel = null, scale = 1.0, soundTriggerCallback = () => {}} : 
    {type : InstrumentTypes, channel? : number, scale? : number, soundTriggerCallback? : NoteTriggerCallbackHandler }) {
      super({scale})

      this.type = type
      this.channel = channel

      this.soundTriggerCallback = soundTriggerCallback
      this.setMode(InstrumentMode.PLAYING)
  }

  setMode(mode : InstrumentMode) {
    this.mode = mode
    this.propagateEvents = (mode == InstrumentMode.SETUP)
  }

  getMode() : InstrumentMode {
    return this.mode
  }

  onMouseEvent(event : string) {
    if (event == 'click')
      this.setMode((this.mode+1)%2)
  }

  addChild(orbit : Orbit) : Orbit {
    super.addChild(orbit)
    return orbit
  }

  get orbits() : Orbit[] {
    return <Orbit[]>this.children;
  }

  update(time: number, bpm: number) {
    this.orbits.forEach( (orbit : Orbit) => {
      orbit.update(time, bpm)
    })
  }

  draw(stage : Stage) {
    if (this.getMode() == InstrumentMode.PLAYING)
      this.props.fill = '#eeeeee'
    else
      this.props.fill = '#000000'
    super.draw(stage)
    this.drawStepLine(stage)
  }

  drawStepLine(stage : Stage) {
    const { stroke, size, strokeWidth } = this.props
    const context = stage.renderer
    context.globalAlpha = 0.05
    context.strokeStyle = stroke
    context.lineWidth = strokeWidth * this.scale

    context.beginPath()
    context.moveTo(0.12,0)
    context.lineTo(1,0)
    context.closePath()
    context.stroke()
  }
}

export { InstrumentPlanet, InstrumentMode }