import WebMidi from 'webmidi';
import { OutputDevice } from './outputs'

class MidiOutput extends OutputDevice {

  constructor({ channel = 0 }) {
    super()

    this.midiChannel = channel
    this.midiOutput = null
  }

  isEnabled() {
    return WebMidi.enabled && this.enabled
  }

  async enable(enable) {
    return new Promise( (resolve, reject) => {
      this.enabled = enable
      if (enable && !WebMidi.enabled) {
        WebMidi.enable( (err) => {
          if (err) {
            console.warn("web midi could not be enabled")
            reject(err)
          } else
            resolve()
        })
        
      } else {
        resolve()
      }
  })
     
  }

  get outputs() {
    console.log(WebMidi.outputs)
    return WebMidi.outputs
  }

  // set to null to use all outputs
  setOutput(outputIndex = null) {
    if (outputIndex != null && outputIndex > this.outputs.length)
      console.warn("cannot select midi device with this index")
    // this.midiOutput = this.outputs[outputIndex]
  }

  scheduleNote(note, duration, time = undefined) {
    if (this.midiOutput)
      this.midiOutput.playNote(note, this.midiChannel, { time: time, duration: duration });
    else
      this.outputs.forEach( (output) => {
        output.playNote(note, this.midiChannel, { time: time, duration: duration });
      })
  }

  get time() {
    return WebMidi.time
  }

  clear() {}

  stop() {}
}

export { MidiOutput }