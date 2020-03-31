import _ from 'lodash';
import { Stage } from "./engine/stage"
import { CanvasElement } from './engine/canvasElement'
import { InstrumentPlanet, NotePlanet } from './components/instrumentPlanets'
import { GatePlanet, BurstPlanet } from './components/modulationPlanets'
import { InstrumentTypes, Note, SoundParam, Sound } from './sound/types'
import { scales } from './sound/scales'
//@ts-ignore 
import random from 'canvas-sketch-util/random'
import { sampler, enableSound } from './sound/sampler';
//@ts-ignore 
import palettes from 'nice-color-palettes'

const settings = {
  width: 512,
  height: 512,
  zoom: 0.7 
}

function generateSimulationParams(debug = false) : any {
  return debug ? {
    bpm : 30,
    numberOfNotes: 1,
    scale : [0],
    transpose : 0,
    colors : ['white']
  } : {
    bpm : random.range(10,60),
    numberOfNotes: random.range(4,20),
    scale : random.pick(scales),
    transpose : random.rangeFloor(12),
    colors : random.pick(palettes)
  }
}

window.addEventListener('load', () => {
  var enabled = false
  var soundbutton = document.getElementById('button-sound')
  soundbutton.innerHTML = "Sound off"
  enableSound(false)
  soundbutton.addEventListener('click', () => {
    enableSound(enabled = !enabled)
    soundbutton.innerHTML = enabled ? "Sound on" : "Sound off"
  })

  var randomizeButton = document.getElementById('button-randomize')
  randomizeButton.addEventListener('click', () => {
    app.restart() 
  })
})

const app = (function() {

  const stage = new Stage({ width: settings.width, height: settings.height })
  const root = new CanvasElement({ x: stage.width/2, y: stage.height/2, scale: Math.min(stage.width, stage.height)/2})

  // create root node
  var instrument = new InstrumentPlanet({x: 0, y: 0, scale: settings.zoom, type : InstrumentTypes.MIDI, noteTriggerCallback : onNoteTriggered})

  // create sampler
  const piano = sampler 
  function onNoteTriggered(sound: Sound, step: number) {
    console.debug(['play note', Note.fromInt(sound.note.sum) + sound.octave.sum, sound.gate.sum])
    if (piano.loaded)
      piano.triggerAttackRelease(Note.fromInt(sound.note.sum) + sound.octave.sum, sound.gate.sum);
  }

  // add instrument to canvas
  root.addChild(instrument)

  // param object
  var params : any = {}

  function createTestScene() {
    instrument.clear()

    params = generateSimulationParams(true)

    var note = new NotePlanet({
        note: 'C', 
        octave: 3, 
        distance: 1/4, 
        phase : 0,
        fill : 'white',
    })

    note.addChild(new GatePlanet({ distance : 1, steps : 4, phase: 0.25, gate : [-0.9,-0.5,0.0,1.0]}))
    note.addChild(new BurstPlanet({ distance: 1, repeats : 10 }))

    instrument.addChild(note) 

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
        distance: random.pick([1,1/2,1/4]), 
        phase : random.rangeFloor(0,8)/8,
        fill : params.colors[noteIndex % params.colors.length],
        gate: random.range(0.1,2.0)
      })) 
    })
  } 
  
  function loop(time : number = 0.0, dt : number = 0.0) {
      var context = stage.renderer
      context.resetTransform()
      context.lineWidth = 1/stage.width

      //clear canvas
      context.globalAlpha = 1.0
      context.fillStyle = 'white'
      context.fillRect(0,0, stage.width, stage.height)

      // update all nodes
      instrument.update(time, params.bpm || 0)

      // draw lines between planets
      instrument.drawConnections(stage, 0.2)
      
      //draw everything
      root.draw(stage)

      requestAnimationFrame((time) => loop(time / 1000 ));
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
    }
  }
})()

export { app }
