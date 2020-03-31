import { InstrumentTypes, SoundParam, Note, Sound } from '../sound/types'
import { BasePlanet, TriggerCallbackHandler } from './basePlanets'
import { GatePlanet, BurstPlanet } from './modulationPlanets'
import { Stage } from '../engine/stage'

interface NoteTriggerCallbackHandler {
  (sound : Sound, step : number) : void
}

class InstrumentPlanet extends BasePlanet {

  noteTriggerCallback : NoteTriggerCallbackHandler

  type : InstrumentTypes
  channel : number

  constructor(
    {x, y, type, channel = null, scale = 1.0, noteTriggerCallback = () => {}} : 
    {x:number, y: number, type : InstrumentTypes, channel? : number, scale? : number, noteTriggerCallback? : NoteTriggerCallbackHandler }) {
      super({x,y,scale}, {size: 0.07, fill: '#eeeeee'})

      this.type = type
      this.channel = channel

      this.noteTriggerCallback = noteTriggerCallback
  }

  onChildTriggered(child : BasePlanet, step: number) {
    if (child instanceof NotePlanet)
      this.noteTriggerCallback(child.parameters, step)
  }

  drawStepLine(stage : Stage) {
    const { stroke, size } = this.props
    const context = stage.renderer
    context.globalAlpha = 0.1
    context.strokeStyle = stroke

    context.beginPath()
    context.lineWidth = 1/stage.maxSide
    context.moveTo(0, -1 * (size + this.style.margin))
    context.lineTo(0, -1 * this.style.stepsLineLength)
    context.closePath()
    context.stroke()
  }

  draw(stage : Stage) {
    super.draw(stage)
    this.drawStepLine(stage)
  }
}

class NotePlanet extends BasePlanet {

  parameters = new Sound()

  constructor({ octave, distance, note, phase = 0.0, gate = 0.5, fill = '#eeeeee' } : { octave: number, distance: number, note: string, phase?: number, gate? : number, fill? : string }) {
    super({x: 0,y: 0}, {distance, phase, steps: 1, fill})

    this.props.size = 0.08 - octave*0.01

    this.parameters.length.val = 1/distance
    this.parameters.gate.val = gate
    this.parameters.note.val = Note.toInt(note)
    this.parameters.octave.val = octave

  }

  onChildTriggered(child : BasePlanet, step: number) {
    if (child instanceof GatePlanet) {
      this.parameters.gate.mod = child.modulationParams.gate[step % child.modulationParams.gate.length]
    } else if (child instanceof BurstPlanet) {
      this.parameters.repeats.mod = child.modulationParams.repeats
    }
  }

  onTriggered(time: number, step : number) {
    super.onTriggered(time, step)

    if (this.parameters.repeats.mod > 0) {
      this.parameters.repeats.mod = 0.0
    }
  }

  // burst(repeats : number, currentStep : number) {
  //   console.log(["burst", this.parameters])
  //   var count = repeats
  //   const bpm = 60
  //   var interval = setInterval(() => {
  //     this.options.triggerCallback(this, currentStep)
  //     count--
  //     if (count-- < 1)
  //       clearInterval(interval)
  //   }, this.parameters.length.sum * 60 / bpm * 1000 / repeats)
  // }
}

export { NotePlanet, InstrumentPlanet }