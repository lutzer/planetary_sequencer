import _ from 'lodash';
import { Stage } from "./engine/stage"
import { CanvasElement } from './engine/canvasElement'
import { InstrumentPlanet, NotePlanet } from './components/instrumentPlanets'
import { GatePlanet, BurstPlanet } from './components/modulationPlanets'
import { InstrumentTypes, Note, SoundParam } from './sound/types'
//@ts-ignore 
import random from 'canvas-sketch-util/random'
import { sampler, enableSound } from './sound/sampler';

const settings = {
  width: 512,
  height: 512,
  zoom: 0.8,
  bpm : 30,
  notes: 10
}

window.addEventListener('load', () => {
  var enabled = false
  enableSound(enabled)
  var button = document.getElementById('button-sound')
  button.addEventListener('click', () => {
    enabled = !enabled
    enableSound(enabled)
    button.innerHTML = enabled ? "Sound on" : "Sound off"
  })
})

const App = function() {

  const stage = new Stage({ width: settings.width, height: settings.height })
  const root = new CanvasElement({ x: stage.width/2, y: stage.height/2, scale: Math.min(stage.width, stage.height)/2})

  // setup scene
  var instrument = new InstrumentPlanet({x: 0, y: 0, scale: settings.zoom, type : InstrumentTypes.MIDI, noteTriggerCallback : onNoteTriggered})

  // var note1 = new NotePlanet({note: 'E', octave: 2, distance: 1/2, phase : 1/5})
  // note1.addChild(new GatePlanet({distance: 1/2, steps: 2}))
  // note1.addChild(new BurstPlanet({distance: 1, steps: 1, phase: 0.3, repeats : 10}))

  // instrument.addChild(note1)

  _.range(settings.notes).forEach( () => {
    instrument.addChild( new NotePlanet({
      note: Note.fromInt(random.rangeFloor(0,12)), 
      octave: random.rangeFloor(1,5), 
      distance: random.pick([1,1/2,1/4]), 
      phase : random.rangeFloor(0,8)/8
    }))
  })


  root.addChild(instrument)

  const piano = sampler 
  function onNoteTriggered(params: { [name: string]: SoundParam }, step: number) {
    console.log([params, step])
    if (piano.loaded)
      piano.triggerAttack(Note.fromInt(params.note.sum) + params.octave.sum);
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
      instrument.update(dt, settings.bpm)

      // draw lines between planets
      instrument.drawConnections(stage, 0.2)
      
      //draw everything
      root.draw(stage)

      requestAnimationFrame((newTime) => loop(newTime, (newTime - time) / 1000 ));
  }

  return {
    start : () => {
      loop()
    }
  }
}

export { App }
