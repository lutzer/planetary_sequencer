import { InstrumentTypes, SoundParam, Note } from '../sound/types'
import { BasePlanet, TriggerCallbackHandler } from './basePlanets'
import { GatePlanet, BurstPlanet } from './modulationPlanets'
import { Stage } from '../engine/stage'

interface NoteTriggerCallbackHandler {
  (params : { [name: string]: SoundParam }, step : number) : void
}

class InstrumentPlanet extends BasePlanet {

  noteTriggerCallback : NoteTriggerCallbackHandler

  constructor(
    {x, y, type, channel = null, scale = 1.0, noteTriggerCallback = () => {}} : 
    {x:number, y: number, type : InstrumentTypes, channel? : number, scale? : number, noteTriggerCallback? : NoteTriggerCallbackHandler }) {
      super({x,y,scale}, { type, channel, size: 0.1})

      this.noteTriggerCallback = noteTriggerCallback
  }

  onChildTriggered(child : BasePlanet, step: number) {
    if (child instanceof NotePlanet)
      this.noteTriggerCallback(child.parameters, step)
  }

  drawStepLine(stage : Stage) {
    const { stroke, size } = this.options
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

  parameters = {
    gate : new SoundParam(0.5),
    note : new SoundParam(0),
    octave : new SoundParam(1),
    repeats : new SoundParam(0),
    length : new SoundParam(1)
  }

  constructor({ octave, distance, note, phase = 0.0, gate = 0.5 } : { octave: number, distance: number, note: string, phase?: number, gate? : number }) {
    super({x: 0,y: 0}, {distance, phase, steps: 1, size: 0.08 - octave*0.01, fill: '#eeeeee'})

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

  onTriggered(step : number) {
    super.onTriggered(step)
    // reset repeat parameter when triggered
    this.parameters.repeats.mod = 0.0
  }
}

export { NotePlanet, InstrumentPlanet }