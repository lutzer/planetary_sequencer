
enum InstrumentTypes {
  MIDI, SAMPLER
}

class Note {
  note : string

  constructor(note : string) {
    this.note = note
  }

  toInt() : number {
    const map : {[key: string]: number} = {
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
    return map[this.note]
  }
}

export { InstrumentTypes, Note }