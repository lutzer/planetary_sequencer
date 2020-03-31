//@ts-ignore
import webmidi from 'webmidi';
import _ from 'lodash'

class OutputDevice {

  enabled : boolean = false

  constructor() {}

  scheduleNote(note : string, duration: number, time: number = null) {}
  
  isEnabled() : boolean {
    return this.enabled
  }

  async enable(enable : boolean) {}

  clear() {}

  stop() {}

  get time() : number {
    return 0
  }

}

class MidiOutput extends OutputDevice {

  midiChannel : number = 0
  midiOutput : webmidi.MIDIOutput = null

  constructor({ channel = 1} : { channel : number }) {
    super()

    this.midiChannel = channel
  }

  isEnabled() : boolean {
    return webmidi.enabled && this.enabled
  }

  async enable(enable : boolean) : Promise<any> {
    return new Promise( (resolve, reject) => {
      this.enabled = enable
      if (enable) 
        webmidi.enable( (err : any) => {
          if (err) {
            console.warn("web midi could not be enabled")
            reject(err)
          } else
            if (!_.isEmpty(this.outputs))
              this.setOutput(this.outputs[0])
            resolve()
        })
    })
  }

  get outputs() : MidiOutput[] {
    return webmidi.outputs
  }

  setOutput(output : MidiOutput) {
    this.midiOutput = output
  }

  scheduleNote(note : string, duration: number, time: number = null) {
    if (!this.midiOutput) {
      console.warn("No Midi device selected")
      return
    }
    time = time || this.time
    this.midiOutput.playNote(note, this.midiChannel, { time: time, duration: duration });
  }

  get time() : number {
    return webmidi.time
  }
}

export { OutputDevice, MidiOutput }