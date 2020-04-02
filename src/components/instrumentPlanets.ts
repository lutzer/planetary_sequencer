import { InstrumentTypes, SoundTrigger } from '../sound/types'
import { BasePlanet, BaseTriggerPlanet } from './basePlanets'
import { NotePlanet } from './notePlanets'
import { Stage } from '../engine/stage'

interface NoteTriggerCallbackHandler {
  (sound : SoundTrigger, atTime: number, step : number) : void
}

class InstrumentPlanet extends BasePlanet {

  soundTriggerCallback : NoteTriggerCallbackHandler

  protected type : InstrumentTypes
  protected channel : number

  constructor(
    {x, y, type, channel = null, scale = 1.0, soundTriggerCallback = () => {}} : 
    {x:number, y: number, type : InstrumentTypes, channel? : number, scale? : number, soundTriggerCallback? : NoteTriggerCallbackHandler }) {
      super({x,y,scale}, {size: 0.07, fill: '#eeeeee'})

      this.type = type
      this.channel = channel

      this.soundTriggerCallback = soundTriggerCallback
  }

  addChild(planet : BaseTriggerPlanet) {
    super.addChild(planet)
    planet.triggerCallback = (planet, time, step) => this.onChildTriggered(planet, time, step)
  }

  onChildTriggered(child : BaseTriggerPlanet, atTime: number, step: number) {
    if (child instanceof NotePlanet)
      this.soundTriggerCallback(child.triggerParameters, atTime, step)
  }

  drawStepLine(stage : Stage) {
    const { stroke, size } = this.props
    const context = stage.renderer
    context.globalAlpha = 0.1
    context.strokeStyle = stroke

    context.beginPath()
    context.lineWidth = 1/stage.maxSide
    context.moveTo(0, -1 * (size + this.STYLE.margin))
    context.lineTo(0, -1 * this.STYLE.stepsLineLength)
    context.closePath()
    context.stroke()
  }

  draw(stage : Stage) {
    super.draw(stage)
    this.drawStepLine(stage)
  }
}

export { NotePlanet, InstrumentPlanet }