import { BasePlanet } from './baseElements'
import { Note, SoundTrigger } from '../sound/types'
import { Orbit } from './orbit';
import { Stage } from '../engine/stage';

class NotePlanet extends BasePlanet {

  triggerParameters = new SoundTrigger()

  orbit : Orbit = null

  constructor(
    { octave, note, phase = 0.0, gate = 0.5, fill = '#aaaaaa' } : 
    { octave: number, note: string, phase?: number, gate? : number, fill? : string }) {
    super({scale: 0.2, phase, fill})

    this.triggerParameters.length.val = 1
    this.triggerParameters.gate.val = gate
    this.triggerParameters.note.val = Note.toInt(note)
    this.triggerParameters.octave.val = octave
  }

  update(angle: number, distance: number) {
    const phaseRad = this.props.phase * Math.PI * 2
    this.position = [ Math.cos(phaseRad+angle) * distance, Math.sin(phaseRad+angle) * distance ]
  }

  draw(stage : Stage) {
    super.draw(stage)
  }
}

export { NotePlanet }