import _ from 'lodash'

enum InstrumentTypes {
  MIDI, SAMPLER
}

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

class SoundParam {
  val : number
  mod : number

  constructor(value : number, modulation : number = 0.0) {
    this.val = value
    this.mod = modulation
  }

  get sum() : number {
    return this.val + this.mod
  }
}

export { InstrumentTypes, Note, SoundParam }