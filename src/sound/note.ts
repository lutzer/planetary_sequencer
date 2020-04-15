import _ from 'lodash'

class Note {
  static readonly map : {[key: string]: number} = {
    'C': 0,
    'C#': 1,
    'D': 2,
    'D#': 3,
    'E' : 4,
    'F' : 5,
    'F#' : 6,
    'G' : 7,
    'G#' : 8,
    'A' : 9,
    'A#' : 10,
    'B' : 11
  }

  static toInt(note : string) : number {
    return this.map[note]
  }
  static fromInt(n : number) : string {
    return _.keys(this.map)[n]
  }
}

type NoteTriggerProperties = 'gate' | 'note' | 'octave' | 'repeats' | 'length'

class NoteTrigger {

  gate = new NoteParam(1.0)
  note = new NoteParam(0)
  octave = new NoteParam(3)
  repeats = new NoteParam(0)
  length = new NoteParam(1.0)

  // scale = [0,1,2,3,4,5,6,7,8,9,11]
  // rootNote = 0

  getNoteString() : string {
    return Note.fromInt(this.note.sum) + this.octave.sum 
  }

  getNoteDuration() : number {
    return this.length.sum * this.gate.sum
  }

  getNote() : number {
    return this.note.sum
  }

  getLength() : number {
    return this.length.sum
  }

  getGate() : number {
    return this.gate.sum
  }

  getRepeats() : number {
    return this.repeats.sum
  }

  getOctave() : number {
    return this.octave.sum
  }

  // setScale(rootNote: number, scale : number[]) {
  //   this.rootNote = rootNote
  //   this.scale = scale
  // }
}

class NoteParam {
  val : number
  mod : number

  constructor(value : number, modulation : number = 0.0) {
    this.val = value
    this.mod = modulation
  }

  get sum() : number {
    return Math.max(0, this.val + this.mod)
  }
}

export { Note, NoteTrigger, NoteTriggerProperties, NoteParam }