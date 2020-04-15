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

export { OutputDevice }