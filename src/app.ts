import _ from 'lodash';
import { Stage } from "./engine/stage"
import { SynthStorage } from './storage/storage';
import { OutputDevice } from './sound/outputs';
import { PlanetSystem, PlanetSystemProperties } from './components/planetSystem';
import { CanvasElement } from './engine/canvasElement';

const settings = {
  width: 512,
  height: 512,
  fps : 60
}

const app = ( function() {

  const audioOutput = new OutputDevice()
  const storage = new SynthStorage()
  const stage = new Stage({ width: settings.width, height: settings.height })
  // const root = new CanvasElement({x: settings.width/2, y: settings.height/2, scale: settings.scale})
  const root = new CanvasElement({x: settings.width/2, y: settings.height/2, scale: stage.maxSide, rotation: -Math.PI/2})
  
  var props : PlanetSystemProperties[] = null
  var systems : PlanetSystem[] = []

  stage.onMouseEvent( (event) => {
    systems.forEach( (system) => system.handleMouseEvent(event) )
  })
  
  function setup(defaultValues = false) {

    // load data
    props = storage.load(true)

    // create systems
    systems = props.map( (p) => new PlanetSystem(p,root))
  } 
  
  function loop(time : number = 0.0, updated : number = 0.0) {

    time = Math.round(audioOutput.time)

    if ((time-updated) > 1000/settings.fps) {
      var context = stage.context
      context.resetTransform()

      //clear canvas
      context.globalAlpha = 1.0
      context.fillStyle = 'white'
      context.fillRect(0,0, stage.width, stage.height)

      // update systems
      systems.forEach((system) => system.update(time))

      // render all systems
      systems.forEach((system) => system.render(stage))

      updated = time
    }

    requestAnimationFrame(() => loop(time, updated));
  }

  return {
    start : () => {
      setup()
      loop()
    },
    // save : () => {
    //   storage.save(instrument)
    // },
    // reset : () => {
    //   setup(true)
    // },
    // enableSound(enable : boolean) {
    //   audioOutput.enable(enable)
    // },
    // setBpm(bpm : number) {
    //   instrument.bpm = bpm
    // },
    // getBpm() : number {
    //   return instrument.bpm
    // },
    // setMidiChannel(channel : number) {
    //   audioOutput.midiChannel = channel
    // }
  }
})()

export { app }
