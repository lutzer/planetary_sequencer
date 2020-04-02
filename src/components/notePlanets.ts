import { BasePlanet, TriggerCallbackHandler, BaseTriggerPlanet } from './basePlanets'
import { Note, SoundTrigger } from '../sound/types'
import { GatePlanet, BurstPlanet } from './modulationPlanets'

class NotePlanet extends BaseTriggerPlanet {

  triggerParameters = new SoundTrigger()

  constructor({ octave, distance, note, phase = 0.0, gate = 0.5, fill = '#eeeeee' } : { octave: number, distance: number, note: string, phase?: number, gate? : number, fill? : string }) {
    super({x: 0,y: 0}, {distance, phase, steps: 1, fill})

    this.props.size = 0.08 - octave*0.01

    this.triggerParameters.length.val = 1/distance
    this.triggerParameters.gate.val = gate
    this.triggerParameters.note.val = Note.toInt(note)
    this.triggerParameters.octave.val = octave
  }

  onChildTriggered(child : BasePlanet, step: number) {
    if (child instanceof GatePlanet) {
      this.triggerParameters.gate.mod = child.modulationParams.gate[step % child.modulationParams.gate.length]
    } else if (child instanceof BurstPlanet) {
      this.triggerParameters.repeats.mod = child.modulationParams.repeats
    }
  }

  onTriggered(time: number, step : number) {
    this.triggerCallback(this, time, step)
  }
}

export { NotePlanet }