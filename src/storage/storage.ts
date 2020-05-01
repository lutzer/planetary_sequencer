import { PlanetSystemProperties } from "../components/planetSystem"

const defaultValue : PlanetSystemProperties = {
  channel: 1,
  noteRoot: 1,
  noteScale: 'chromatic',
  position: [0,0],
  orbits : [
    { speed : 1/2, steps: 8, snap: true, priority: 0, planets: [
      { note: 5, octave: 6, phase: 0.2, gate: 1},
      { note: 6, octave: 1, phase: 0.9, gate: 1},
    ]},
    { speed : 1, steps: 16, snap: true, priority: 0, planets: [
      { note: 0, octave: 3, phase: 0, gate: 1},
      { note: 2, octave: 4, phase: 0.5, gate: 1}
    ]},
    { speed : 2, steps: 32, snap: false, priority: 0, planets: []}
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