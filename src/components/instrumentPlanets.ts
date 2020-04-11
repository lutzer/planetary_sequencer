import { InstrumentTypes, SoundTrigger } from '../sound/types'
import { BasePlanet } from './baseElements'
import { Stage } from '../engine/stage'
import { Orbit } from './orbit'

interface NoteTriggerCallbackHandler {
  (sound : SoundTrigger, atTime: number, step : number) : void
}

class InstrumentPlanet extends BasePlanet {

  soundTriggerCallback : NoteTriggerCallbackHandler

  protected type : InstrumentTypes
  protected channel : number

  constructor(
    {type, channel = null, scale = 1.0, soundTriggerCallback = () => {}} : 
    {type : InstrumentTypes, channel? : number, scale? : number, soundTriggerCallback? : NoteTriggerCallbackHandler }) {
      super({scale, fill: '#eeeeee'})

      this.type = type
      this.channel = channel

      this.soundTriggerCallback = soundTriggerCallback
  }

  addChild(orbit : Orbit) : Orbit {
    super.addChild(orbit)
    return orbit
  }

  get orbits() : Orbit[] {
    return <Orbit[]>this.children;
  }

  update(time: number, bpm: number) {
    this.orbits.forEach( (orbit : Orbit) => {
      orbit.update(time, bpm)
    })
  }

  draw(stage : Stage) {
    super.draw(stage)
  }
}

export { InstrumentPlanet }