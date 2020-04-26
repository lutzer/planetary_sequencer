import { PlanetSystemProperties } from "../components/planetSystem"

const defaultValue : PlanetSystemProperties = {
  channel: 1,
  noteRoot: 1,
  noteScale: 'chromatic',
  position: [0.5,0.5],
  bpm: 30,
  orbits : [
    { speed : 1/4, steps: 8, snap: true, planets: []},
    { speed : 1/2, steps: 16, snap: true, planets: [
      { note: 0, octave: 3, phase: 0, gate: 1},
      { note: 0, octave: 4, phase: 0.5, gate: 1}
    ]},
    { speed : 1, steps: 32, snap: false, planets: []}
  ]
}

class SynthStorage {

  constructor() {
    if (typeof(Storage) === "undefined")
      console.warn("local storage not available")
  }

  load(loadDefault : boolean = false) : PlanetSystemProperties[] {
    var loadedData = null
    if (!loadDefault) {
      try {
        loadedData = JSON.parse(localStorage.getItem('data'))
      } catch (err) {
        console.warn("Could not load saved data")
      }
    }
    // default settings
    return Object.assign(
      [defaultValue], loadedData)
  }

  save(data: PlanetSystemProperties) {
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

export { SynthStorage }