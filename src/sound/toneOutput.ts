import { OutputDevice } from "./outputs";

const Tone = require('tone')


class SamplerOutput extends OutputDevice {

  sampler : any

  constructor() {
    super()
    this.sampler = new Tone.Sampler({
      "A0" : "A0.[mp3|ogg]",
      "C1" : "C1.[mp3|ogg]",
      "D#1" : "Ds1.[mp3|ogg]",
      "F#1" : "Fs1.[mp3|ogg]",
      "A1" : "A1.[mp3|ogg]",
      "C2" : "C2.[mp3|ogg]",
      "D#2" : "Ds2.[mp3|ogg]",
      "F#2" : "Fs2.[mp3|ogg]",
      "A2" : "A2.[mp3|ogg]",
      "C3" : "C3.[mp3|ogg]",
      "D#3" : "Ds3.[mp3|ogg]",
      "F#3" : "Fs3.[mp3|ogg]",
      "A3" : "A3.[mp3|ogg]",
      "C4" : "C4.[mp3|ogg]",
      "D#4" : "Ds4.[mp3|ogg]",
      "F#4" : "Fs4.[mp3|ogg]", 
      "A4" : "A4.[mp3|ogg]",
      "C5" : "C5.[mp3|ogg]",
      "D#5" : "Ds5.[mp3|ogg]",
      "F#5" : "Fs5.[mp3|ogg]",
      "A5" : "A5.[mp3|ogg]",
      "C6" : "C6.[mp3|ogg]",
      "D#6" : "Ds6.[mp3|ogg]",
      "F#6" : "Fs6.[mp3|ogg]",
      "A6" : "A6.[mp3|ogg]",
      "C7" : "C7.[mp3|ogg]",
      "D#7" : "Ds7.[mp3|ogg]",
      "F#7" : "Fs7.[mp3|ogg]",
      "A7" : "A7.[mp3|ogg]",
      "C8" : "C8.[mp3|ogg]"
    }, {
      "release" : 1,
      "baseUrl" : "./assets/samples/"
    }).toMaster();

    Tone.Master.mute = true
  }

  async enable(enable : boolean) {
    if (enable) {
      Tone.start()
    }
    Tone.Master.mute = !enable
    return Promise.resolve()
  }

  scheduleNote(note : string, duration: number, time: number = null) {
    this.sampler.triggerAttackRelease(note, duration/1000, time/1000)
  }

  isEnabled() : boolean {
    return this.sampler.loaded && !Tone.Master.mute
  }

  get time() : number {
    return Tone.context.currentTime * 1000
  }
}

class SynthOutput extends OutputDevice {

  synth : any
  
  constructor() {
    super()

    this.synth = new Tone.MonoSynth({
      oscillator : {
      type : "sine"
    },
    envelope: {
      attack : 0.05,
      release : 0.1,
      attackCurve : 'exponential' ,
      releaseCurve : 'linear'
    },
    filter : {
      Q : 6 ,
      type : 'lowpass',
      rolloff : -24,
      gain: 0.5
    }
    }).toMaster();
  }

  async enable(enable : boolean) {
    if (enable) {
      Tone.start()
    }
    Tone.Master.mute = !enable
    return Promise.resolve()
  }

  isEnabled() : boolean {
    return !Tone.Master.mute
  }

  scheduleNote(note : string, duration: number, time: number = null) {
    this.synth.triggerAttackRelease(note, duration/1000, time/1000)
  }

  get time() : number {
    return Tone.context.currentTime * 1000
  }
}

export { SamplerOutput, SynthOutput }