//@ts-ignore
// import WebMidi from 'webmidi';
import _ from 'lodash'

class OutputDevice {

  enabled : boolean = false

  constructor() {}

  scheduleNote(note : string, duration: number, time: number = null) {
    console.debug(['schedule note', note, duration, time])
  }
  
  isEnabled() : boolean {
    return this.enabled
  }

  async enable(enable : boolean) {}

  clear() {}

  stop() {}

  get time() : number {
    return performance.now()
  }

}

// class MidiOutput extends OutputDevice {

//   midiChannel : number = 0
//   midiOutput : WebMidi.MIDIOutput = null

//   constructor({ channel = 1} : { channel : number }) {
//     super()

//     this.midiChannel = channel
//   }

//   isEnabled() : boolean {
//     return WebMidi.enabled && this.enabled
//   }

//   async enable(enable : boolean) : Promise<any> {
//     return new Promise( (resolve, reject) => {
//       this.enabled = enable
//       if (enable && !WebMidi.enabled) {
//         WebMidi.enable( (err : any) => {
//           if (err) {
//             console.warn("web midi could not be enabled")
//             reject(err)
//           } else
//             resolve()
//         })
        
//       } else {
//         resolve()
//       }
//   })
     
//   }

//   get outputs() : WebMidi.MidiOutput[] {
//     return WebMidi.outputs
//   }

//   // set to null to use all outputs
//   setOutput(outputIndex : number = null) {
//     if (outputIndex != null && outputIndex > this.outputs.length)
//       console.warn("cannot select midi device with this index")
//     this.midiOutput = this.outputs[outputIndex]
//   }

//   scheduleNote(note : string, duration: number, time: number = undefined) {
//     if (this.midiOutput)
//       this.midiOutput.playNote(note, this.midiChannel, { time: time, duration: duration });
//     else
//       this.outputs.forEach( (output : WebMidi.MIDIOutput) => {
//         output.playNote(note, this.midiChannel, { time: time, duration: duration });
//       })
//   }

//   get time() : number {
//     return WebMidi.time
//   }
// }

export { OutputDevice, /*MidiOutput */ }