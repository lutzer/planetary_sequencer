import { BasePlanet } from './baseElements'
import { Note, SoundTrigger } from '../sound/types'
import { Orbit } from './orbit';
import { Stage } from '../engine/stage';
import { euclidianDistance } from '../engine/utils';

function snapTo(value : number, steps : number) : number  {
  return Math.round(value * steps) / steps
}

class NotePlanet extends BasePlanet {

  note = new SoundTrigger()
  currentAngle : number = 0

  constructor(
    { octave, note, phase = 0.0, gate = 0.5, fill = '#eeeeee' } : 
    { octave: number, note: string, phase?: number, gate? : number, fill? : string }) {
    super({scale: 1.0, phase, fill, size : 0.3})

    this.note.length.val = 1
    this.note.gate.val = gate
    this.note.note.val = Note.toInt(note)
    this.note.octave.val = octave

    this.handleEventTypes = ['mousedown', 'mouseup', 'mousemove']
  }

  update(angle: number, distance: number) {
    const phaseRad = this.props.phase * Math.PI * 2
    this.currentAngle = phaseRad+angle
    this.position = [ Math.cos(this.currentAngle) * distance, Math.sin(this.currentAngle) * distance ]
  }

  draw(stage : Stage) {
    if (this.selected)
      this.props.fill = 'black'
    else
      this.props.fill = '#eeeeee'
    super.draw(stage)
  }

  get orbit() : Orbit {
    return <Orbit>this.parent
  }

  onMouseEvent(event: string, pos : [number, number]) {
    if (event == 'mousedown') {
      this.selected = true
    } else if (event == 'mouseup') {
      this.selected = false
    } else if (this.selected && 'mousemove') {
      const angle = Math.atan2(pos[1]+this.y,pos[0]+this.x)
      if (this.orbit.props.snap)
        this.props.phase = snapTo(angle / (Math.PI*2), this.orbit.props.steps)
      else
        this.props.phase = angle / (Math.PI*2)
    }
  }
}

export { NotePlanet }