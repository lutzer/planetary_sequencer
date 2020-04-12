import { InstrumentTypes, SoundTrigger } from '../sound/types'
import { BasePlanet } from './baseElements'
import { Stage } from '../engine/stage'
import { Orbit } from './orbit'

interface NoteTriggerCallbackHandler {
  (sound : SoundTrigger, atTime: number, step : number) : void
}

enum InteractionModes {
  PLAYING, SETUP
}

class InstrumentPlanet extends BasePlanet {

  soundTriggerCallback : NoteTriggerCallbackHandler

  protected type : InstrumentTypes
  protected channel : number

  private interactiveMode : InteractionModes

  constructor(
    {type, channel = null, scale = 1.0, soundTriggerCallback = () => {}} : 
    {type : InstrumentTypes, channel? : number, scale? : number, soundTriggerCallback? : NoteTriggerCallbackHandler }) {
      super({scale})

      this.type = type
      this.channel = channel

      this.soundTriggerCallback = soundTriggerCallback
      this.setMode(InteractionModes.PLAYING)
  }

  setMode(mode : InteractionModes) {
    this.interactiveMode = mode
    this.propagateEvents = mode == InteractionModes.SETUP
  }

  onEvent(event : string) {
    this.setMode((this.interactiveMode +1 )%2)
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
    if (this.interactiveMode == InteractionModes.PLAYING)
      this.props.fill = '#eeeeee'
    else
      this.props.fill = '#000000'
    super.draw(stage)
  }
}

export { InstrumentPlanet }