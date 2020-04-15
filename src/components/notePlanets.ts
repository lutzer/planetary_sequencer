import { BasePlanet, PlanetPulse } from './baseElements'
import { Note, NoteTrigger, NoteTriggerProperties } from '../sound/note'
import { Orbit } from './orbit';
import { Stage } from '../engine/stage';
import { euclidianDistance, snapTo } from '../engine/utils';
import { CanvasMouseEvent, CanvasMouseButton } from '../engine/canvasMouse';
import globals from './../globals'

interface NoteContextMenuHandler {
  (planet : NotePlanet, position: [number, number]) : void
}

class NotePlanet extends BasePlanet {

  note = new NoteTrigger()
  currentAngle : number = 0

  pulse : PlanetPulse = null

  constructor(
    { octave, note, phase = 0.0, gate = 0.5, fill = '#eeeeee' } : 
    { octave: number, note: string, phase?: number, gate? : number, fill? : string }) {
    super({scale: 1.0, phase, fill})

    this.setNoteParam('length', 1)
    this.setNoteParam('length', gate)
    this.setNoteParam('note', Note.toInt(note))
    this.setNoteParam('octave', octave)

    this.setSelected(false)

    this.pulse = new PlanetPulse(this)
  }

  update(time : number, angle: number, distance: number) {
    const phaseRad = this.props.phase * Math.PI * 2
    this.currentAngle = phaseRad+angle
    this.position = [ Math.cos(this.currentAngle) * distance, Math.sin(this.currentAngle) * distance ]

    this.pulse.update(time)
  }

  draw(stage : Stage) {
    if (this.selected)
      this.props.fill = 'black'
    else
      this.props.fill = '#eeeeee'
    super.draw(stage)
    this.pulse.draw(stage)
  }

  setNoteParam(parameter : NoteTriggerProperties, val : number) {
    this.note[parameter].val = val
    if (parameter == 'octave')
      this.props.size = 0.5 - val * 0.05
  }

  get orbit() : Orbit {
    return <Orbit>this.parent
  }

  setSelected(select : boolean) {
    super.setSelected(select)
    if (select)
      this.handleEventTypes = ['mouseup','drag']
    else
      this.handleEventTypes = ['mousedown','click']
  }

  delete() {
    this.orbit.removeChild(this)
  }

  onMouseEvent(event: CanvasMouseEvent) : boolean {
    // if not selected
    if (!this.selected && this.isPointInside(event.pos)) {
      if (event.type == 'mousedown' && event.button == CanvasMouseButton.LEFT)
        this.setSelected(true)
      else if (event.type == 'click' && event.button == CanvasMouseButton.LEFT)
        globals.onNoteContextMenu(this, event.canvasPos)
      return true;
    // if selected
    } else if (this.selected) {
      if (event.type == 'mouseup') {
        this.setSelected(false)
      } else if (event.type == 'drag') {
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

  triggerPulse(atTime: number) {
    this.pulse.trigger(atTime)
  }
}

export { NotePlanet, NoteContextMenuHandler }