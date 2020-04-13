import { BasePlanet } from './baseElements'
import { Note, SoundTrigger } from '../sound/types'
import { Orbit } from './orbit';
import { Stage } from '../engine/stage';
import { euclidianDistance, snapTo } from '../engine/utils';
import { CanvasMouseEvent } from '../engine/interactiveCanvasElement';

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

    this.setSelected(false)
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

  setSelected(select : boolean) {
    this.selected = select
    if (select)
      this.handleEventTypes = ['mouseup','mousemove']
    else
      this.handleEventTypes = ['mousedown']
  }

  onMouseEvent(event: CanvasMouseEvent) : boolean {
    if (event.type == 'mousedown' && this.isPointInside(event.pos)) {
      this.setSelected(true)
      return true
    } else if (this.selected) {
      if (event.type == 'mouseup') {
        this.setSelected(false)
      } else if (event.type == 'mousemove') {
        const angle = Math.atan2(event.pos[1]+this.y,event.pos[0]+this.x)
        if (this.orbit.props.snap)
          this.props.phase = snapTo(angle / (Math.PI*2), this.orbit.props.steps)
        else
          this.props.phase = angle / (Math.PI*2)
      }
      return true
    }
    return false
  }
}

export { NotePlanet }