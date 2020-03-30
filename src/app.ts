import _ from 'lodash';
import { Stage } from "./engine/stage"
import { CanvasElement } from './engine/canvasElement'
import { InstrumentPlanet, NotePlanet } from './components/instrumentPlanets'
import { GatePlanet, BurstPlanet } from './components/modulationPlanets'
import { InstrumentTypes, Note, SoundParam } from './sound/types'
import { scales } from './sound/scales'
//@ts-ignore 
import random from 'canvas-sketch-util/random'
import { sampler, enableSound } from './sound/sampler';

const settings = {
  width: 512,
  height: 512,
  zoom: 0.7
}

function generateSimulationParams() : any {
  return {
    bpm : random.range(10,60),
    numberOfNotes: random.range(4,20),
    scale : random.pick(scales),
    transpose : random.rangeFloor(12)
  }
}

window.addEventListener('load', () => {
  var enabled = false
  var soundbutton = document.getElementById('button-sound')
  soundbutton.innerHTML = "Sound off"
  soundbutton.addEventListener('click', () => {
    enabled = !enabled
    enableSound(enabled)
    soundbutton.innerHTML = enabled ? "Sound on" : "Sound off"
  })
  enableSound(false)

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
  function onNoteTriggered(params: { [name: string]: SoundParam }, step: number) {
    console.log(['play note', Note.fromInt(params.note.sum) + params.octave.sum])
    if (piano.loaded)
      piano.triggerAttack(Note.fromInt(params.note.sum) + params.octave.sum);
  }

  // add instrument to canvas
  root.addChild(instrument)

  // param object
  var params : any = {}

  function randomize() {
    instrument.clear()

    // generate simulation parameters
    params = generateSimulationParams()

    // setup simulation
    _.range(params.numberOfNotes).forEach( () => {
      var note = (random.pick(params.scale) + params.transpose) % 12
      instrument.addChild( new NotePlanet({
        note: Note.fromInt(note), 
        octave: random.rangeFloor(2,6), 
        distance: random.pick([1,1/2,1/4]), 
        phase : random.rangeFloor(0,8)/8
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
      instrument.update(dt, params.bpm || 0)

      // draw lines between planets
      instrument.drawConnections(stage, 0.2)
      
      //draw everything
      root.draw(stage)

      requestAnimationFrame((newTime) => loop(newTime, (newTime - time) / 1000 ));
  }

  return {
    start : () => {
      randomize()
      loop()
    },
    restart : () => {
      randomize()
    }
  }
})()

export { app }
