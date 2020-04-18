import { InstrumentPlanet } from "../components/instrumentPlanets"

type InstrumentModelScheme = {
  bpm : number
  orbits : OrbitModelScheme[]
}

type OrbitModelScheme = {
  speed : number
  steps: number
  snap : boolean
  notes : NoteModelScheme[]
}

type NoteModelScheme = {
  length : number
  gate : number
  note : number
  octave : number
  phase : number
}

class SynthStorage {

  constructor() {
    if (typeof(Storage) === "undefined")
      console.warn("local storage not available")
  }

  load(loadDefault : boolean = false) : InstrumentModelScheme {
    var loadedData = null
    if (!loadDefault) {
      try {
        loadedData = JSON.parse(localStorage.getItem('data'))
      } catch (err) {
        console.info("Could not load saved data")
      }
    }
    // default settings
    return Object.assign({ bpm: 30, orbits: [
      { speed : 1/4, steps: 8, snap: true, notes: []},
      { speed : 1/2, steps: 16, snap: true, notes: [
        { note: 0, octave : 3, phase: 0, length: 1, gate: 1}
      ]},
      { speed : 1, steps: 32, snap: true, notes: []}
    ]}, loadedData)
  }

  save(instrument: InstrumentPlanet) {
    var data : InstrumentModelScheme = {
      bpm: instrument.bpm,
      orbits : instrument.orbits.map ( (orbit) => {
        return orbit.getDataModel()
      })
    }
    try {
      localStorage.setItem('data', JSON.stringify(data))
    } catch (err) {
      console.warn("could not save data to local storage")
    }
  }

  clear() {
    localStorage.setItem('data', null)
  }
}

export { SynthStorage, InstrumentModelScheme, OrbitModelScheme, NoteModelScheme }