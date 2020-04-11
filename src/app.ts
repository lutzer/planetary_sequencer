import _ from 'lodash';
import { Stage } from "./engine/stage"
import { CanvasElement } from './engine/canvasElement'
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

const settings = {
  width: 768,
  height: 768,
  zoom: 0.1
}

function generateSimulationParams() : any {
  random.setSeed(0)
  const rythm = random.pick(rythms)
  return {
    bpm : random.rangeFloor(20,60),
    numberOfNotes: random.range(4,20),
    scale : random.pick(scales),
    transpose : random.rangeFloor(12),
    colors : random.pick(palettes),
    distances : rythm.distances,
    divisor : rythm.divisor,
  }
}

const app = (function() {

  var audioOutput : OutputDevice = new OutputDevice()

  const stage = new Stage({ width: settings.width, height: settings.height })
  const root = new CanvasElement({ x: stage.width/2, y: stage.height/2, scale: Math.min(stage.width, stage.height)/2})

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
  var params : any = {}

  function setup() {
    instrument.clear()

    const orbit1 = instrument.addChild(new Orbit({ distance: 3, steps: 8}))
    orbit1.addChild(new NotePlanet({ octave: 5, note: 'C', phase: 0}))
    orbit1.addChild(new NotePlanet({ octave: 5, note: 'C', phase: 0.3}))


    const orbit2 = instrument.addChild(new Orbit({ distance: 5, steps: 16}))
    orbit2.addChild(new NotePlanet({ octave: 5, note: 'C', phase: 0}))

    // generate simulation parameters
    // params = generateSimulationParams()

    // setup simulation
    // _.range(params.numberOfNotes).forEach( () => {
    //   var noteIndex = random.rangeFloor(params.scale.length)
    //   var note = (params.scale[noteIndex] + params.transpose) % 12
    //   instrument.addChild( new NotePlanet({
    //     note: Note.fromInt(note), 
    //     octave: random.rangeFloor(2,6), 
    //     distance: random.pick(params.distances), 
    //     phase : random.rangeFloor(0,params.divisor)/params.divisor,
    //     fill : params.colors[noteIndex % params.colors.length],
    //     gate: random.range(0.2,2.0)
    //   })) 
    // })
  } 
  
  function loop(time : number = 0.0) {
      var audioTime = Math.round(audioOutput.time)
      var context = stage.renderer
      context.resetTransform()
      context.lineWidth = 1/stage.width

      //clear canvas
      context.globalAlpha = 1.0
      context.fillStyle = 'white'
      context.fillRect(0,0, stage.width, stage.height)

      // update all nodes
      instrument.update(audioTime, params.bpm || 60)

      // draw lines between planets
      // instrument.drawConnections(stage, 0.2)
      
      //draw everything
      root.render(stage)

      requestAnimationFrame(() => loop(time));
  }

  return {
    start : () => {
      setup()
      loop() 
    }
  }
})()

export { app }
