import { NotePlanetProperties } from "./planets"

interface TriggerCallbackHandler {
  (planet : NotePlanetProperties, time : number) : void
}

class TriggerScheduler {
  private lastScheduleCheckTime : number[] = []
  private scheduledTriggers : { time : number, planet : number}[] = []

  private triggerCallbackHandler : TriggerCallbackHandler

  props : {
    interval? : number,
    scheduleAhead? : number
  } = {}

  constructor({interval = 100, triggerCallback = () => {}, scheduleAhead = 0, } : { interval? : number, triggerCallback? : TriggerCallbackHandler, scheduleAhead? : number } = {}) {
    scheduleAhead = scheduleAhead ? scheduleAhead : interval * 1.5
    this.triggerCallbackHandler = triggerCallback
    Object.assign(this.props, {interval, scheduleAhead})
  }

  checkTriggers(orbitIndex : number, planets : NotePlanetProperties[], time : number, orbitalPeriod : number) {
    const { interval, scheduleAhead } = this.props

    if (time - this.lastScheduleCheckTime[orbitIndex] < interval)
      return
    this.lastScheduleCheckTime[orbitIndex] = time

    // remove passed steps from schedule array
    this.scheduledTriggers = this.scheduledTriggers.filter( (val) => val.time > time)

    const startOfPeriod = time - ( time % orbitalPeriod)

    // calculate trigger times for steps
    const planetPhases = planets.map( (planet) => planet.phase)
    const nextTriggers = planetPhases.map( (phase, index) => {
      let nextSteptrigger = startOfPeriod - phase * orbitalPeriod
      while (nextSteptrigger < time)
        nextSteptrigger += orbitalPeriod 
      return nextSteptrigger
    })


    // schedule triggers, when inside schedule window
    nextTriggers.forEach( (triggerTime, i) => {
      if (triggerTime - time < scheduleAhead && !this.scheduledTriggers.find( (t) => i == t.planet && t.time == triggerTime)) {
        this.scheduledTriggers.push({ time: triggerTime, planet: i + orbitIndex*100})
        this.triggerCallbackHandler(planets[i], triggerTime)
      }
    })
  }
}

export { TriggerScheduler }