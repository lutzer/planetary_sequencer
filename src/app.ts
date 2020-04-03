import _ from 'lodash';
import { Stage } from "./engine/stage"
import { CanvasElement } from './engine/canvasElement'
import { InstrumentPlanet, NotePlanet } from './components/instrumentPlanets'
import { GatePlanet, BurstPlanet } from './components/modulationPlanets'
import { InstrumentTypes, Note, SoundTrigger } from './sound/types'
import { scales, rythms } from './sound/audioValues'
//@ts-ignore
import random from 'canvas-sketch-util/random'
import { MidiOutput, OutputDevice } from './sound/outputs'
import { SamplerOutput } from './sound/toneOutput';
//@ts-ignore 
import palettes from 'nice-color-palettes'

const settings = {
  width: 512,
  height: 512,
  zoom: 0.7
}

function generateSimulationParams(debug = false) : any {
  const rythm = random.pick(rythms)
  return debug ? {
    bpm : 30,
    numberOfNotes: 1,
    scale : [0],
    transpose : 0,
    colors : ['white'],
    distances : [1,1/2,1/4],
    divisor: 8
  } : {
    bpm : random.rangeFloor(20,60),
    numberOfNotes: random.range(4,20),
    scale : random.pick(scales),
    transpose : random.rangeFloor(12),
    colors : random.pick(palettes),
    distances : rythm.distances,
    divisor : rythm.divisor
  }
}

const app = (function() {

  var audioOutput : OutputDevice = new SamplerOutput({ instrument : 'piano'})

  const stage = new Stage({ width: settings.width, height: settings.height })
  const root = new CanvasElement({ x: stage.width/2, y: stage.height/2, scale: Math.min(stage.width, stage.height)/2})

  // create root node
  var instrument = new InstrumentPlanet({x: 0, y: 0, scale: settings.zoom, type : InstrumentTypes.MIDI, soundTriggerCallback : onSoundTriggered})

  // create audio output
  function onSoundTriggered(sound: SoundTrigger, atTime: number, step: number) {
    console.debug(['play note', sound.getNote(), sound.getGate()])
    if (audioOutput.isEnabled()) {
      audioOutput.scheduleNote(sound.getNote(), sound.getGate() * 500, atTime)
    }
  }

  // add instrument to canvas
  root.addChild(instrument)

  // param object
  var params : any = {}

  function createTestScene() {
    instrument.clear()

    params = generateSimulationParams(true)

    var note1 = new NotePlanet({
        note: 'C', 
        octave: 3, 
        distance: 1/2, 
        phase : 0.0,
        fill : 'white',
    })

    var note2 = new NotePlanet({
      note: 'D', 
      octave: 3, 
      distance: 1/2, 
      phase : 0.25,
      fill : 'white',
    })

    // note.addChild(new GatePlanet({ distance : 1/9, steps : 4, phase: 0.25, gate : [-0.9,-0.5,0.0,1.0]}))
    // note.addChild(new BurstPlanet({ distance: 1/5, repeats : 10 }))

    instrument.addChild(note1) 
    instrument.addChild(note2) 

  }

  function randomize() {
    instrument.clear()

    // generate simulation parameters
    params = generateSimulationParams()

    // setup simulation
    _.range(params.numberOfNotes).forEach( () => {
      var noteIndex = random.rangeFloor(params.scale.length)
      var note = (params.scale[noteIndex] + params.transpose) % 12
      instrument.addChild( new NotePlanet({
        note: Note.fromInt(note), 
        octave: random.rangeFloor(2,6), 
        distance: random.pick(params.distances), 
        phase : random.rangeFloor(0,params.divisor)/params.divisor,
        fill : params.colors[noteIndex % params.colors.length],
        gate: random.range(0.2,2.0)
      })) 
    })
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
      instrument.update(audioTime, params.bpm || 0)

      // draw lines between planets
      instrument.drawConnections(stage, 0.2)
      
      //draw everything
      root.render(stage)

      requestAnimationFrame(() => loop(time));
  }

  return {
    start : () => {
      randomize()
      loop() 
    },
    startTestScene : () => {
      createTestScene() 
      loop()
    },
    restart : () => {
      randomize() 
    },
    enableSound : (enable : boolean) => {
      audioOutput.enable(enable)
    },
    setBpm : (bpm : number) => {
      params.bpm = bpm
    },
    setOutput : (output : string) => {
      if (output == 'midi')
        audioOutput = new MidiOutput({ channel : 1})
      else if (output == 'piano')
        audioOutput = new SamplerOutput({ instrument : 'piano'})
      else if (output == 'guitar')
        audioOutput = new SamplerOutput({ instrument : 'guitar'})
    },
    getParams : () => {
      return params
    }
  }
})()

export { app }
