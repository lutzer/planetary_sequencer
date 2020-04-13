import _ from 'lodash';
import { Stage } from "./engine/stage"
import { InstrumentPlanet } from './components/instrumentPlanets'
import { InstrumentTypes, Note, SoundTrigger } from './sound/types'
import { scales, rythms } from './sound/audioValues'
//@ts-ignore
import random from 'canvas-sketch-util/random'
import { MidiOutput, OutputDevice } from './sound/outputs'
//@ts-ignore 
import palettes from 'nice-color-palettes'
import { Orbit } from './components/orbit';
import { NotePlanet } from './components/notePlanets';
import { InteractiveCanvasElement, CanvasMouseEventTypes } from './engine/interactiveCanvasElement';

const settings = {
  width: 768,
  height: 768,
  zoom: 0.1,
  fps : 60
}

const app = (function() {

  var audioOutput : OutputDevice = new OutputDevice()

  const stage = new Stage({ width: settings.width, height: settings.height })
  const root = new InteractiveCanvasElement({ 
    x: stage.width/2, 
    y: stage.height/2, 
    scale: Math.min(stage.width, stage.height)/2,
    rotation : -Math.PI/2,
    handleEventTypes : [] //ignore all events
  })

  const eventStrings : CanvasMouseEventTypes[] = ['click','mousedown','mouseup','mousemove']
  eventStrings.forEach( (type) => {
    stage.canvas.addEventListener(type, (event : MouseEvent) => {
      const x = event.offsetX/stage.canvas.clientWidth * stage.width
      const y = event.offsetY/stage.canvas.clientHeight * stage.height
      root.handleMouseEvent(type,[x, y])
    })
  })

  // handler for sound triggers
  function onSoundTrigger(sound: SoundTrigger, atTime: number, step: number) {
    if (audioOutput.isEnabled()) {
      audioOutput.scheduleNote(sound.getNote(), sound.getGate() * 500, atTime)
    }
  }

  // create root node
  var instrument = new InstrumentPlanet({scale: settings.zoom, type : InstrumentTypes.MIDI, soundTriggerCallback : onSoundTrigger})

  // add instrument to canvas
  root.addChild(instrument)

  // param object
  var params : any = {
    bpm : 30
  }

  function setup() {
    instrument.clear()

    const orbit1 = instrument.addChild(new Orbit({ speed: 1/4, steps: 16, snap: true}))
    orbit1.addChild(new NotePlanet({ octave: 5, note: 'C', phase: 0}))
    orbit1.addChild(new NotePlanet({ octave: 5, note: 'C', phase: 0.25}))

    const orbit2 = instrument.addChild(new Orbit({ speed: 1/2, steps: 16, snap: false}))
    orbit2.addChild(new NotePlanet({ octave: 5, note: 'C', phase: 0}))

    const orbit3 = instrument.addChild(new Orbit({ speed: 1, steps: 32, snap: true}))
    orbit3.addChild(new NotePlanet({ octave: 5, note: 'C', phase: 0}))
  } 
  
  function loop(time : number = 0.0, updated : number = 0.0) {

    time = Math.round(audioOutput.time)

    if ((time-updated) > 1000/settings.fps) {
      var context = stage.renderer
      context.resetTransform()

      //clear canvas
      context.globalAlpha = 1.0
      context.fillStyle = 'white'
      context.fillRect(0,0, stage.width, stage.height)

      // update all nodes
      instrument.update(time, params.bpm || 0)
      
      //draw everything
      root.render(stage)

      updated = time
    }

    requestAnimationFrame(() => loop(time, updated));
  }

  return {
    start : () => {
      setup()
      loop() 
    }
  }
})()

export { app }
