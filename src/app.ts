import _ from 'lodash';
import { Stage } from "./engine/stage"
import { InstrumentPlanet, NoteTriggerCallbackHandler } from './components/instrumentPlanets'
import { NoteTrigger } from './sound/note'
import { scales, rythms } from './sound/audioValues'
import { OutputDevice } from './sound/outputs'
//@ts-ignore 
import { Orbit } from './components/orbit';
import { NotePlanet, NoteContextMenuHandler } from './components/notePlanets';
import { InteractiveCanvasElement } from './engine/interactiveCanvasElement';
import { CanvasMouseEvent } from './engine/canvasMouse';
import { NoteMenuOverlay } from './menu/noteMenuOverlay';
import globals from './globals'
import { MidiOutput } from './sound/midiOutput';

const settings = {
  width: 512,
  height: 512,
  zoom: 0.1,
  fps : 60
}

// param object
var params : any = {
  bpm : 10
}

const app = ( function() {

  var audioOutput = new OutputDevice()
  // await audioOutput.enable(true)

  const stage = new Stage({ width: settings.width, height: settings.height })
  const root = new InteractiveCanvasElement({ 
    x: stage.width/2, 
    y: stage.height/2, 
    scale: Math.min(stage.width, stage.height)/2,
    rotation : -Math.PI/2,
    handleEventTypes : [] //ignore all events
  })

  stage.onMouseEvent((event : CanvasMouseEvent) => {
    root.handleMouseEvent(event)
  })

  // handler for sound triggers
  const onNoteTrigger : NoteTriggerCallbackHandler = (sound: NoteTrigger, atTime: number, step: number) => {
    if (audioOutput.isEnabled()) {
      audioOutput.scheduleNote(sound.getNote() + "" + sound.getOctave(), sound.getGate() * 500, atTime)
    }
  }

  // creates menu overlay on note click
  globals.onNoteContextMenu = function(planet: NotePlanet, position : [number, number]) {
    var menu = new NoteMenuOverlay(planet, position)
    stage.container.insertBefore(menu.domElement, stage.canvas)
  }

  // create root node
  var instrument = new InstrumentPlanet({scale: settings.zoom, noteTriggerCallback : onNoteTrigger})

  // add instrument to canvas
  root.addChild(instrument)
  

  function setup() {
    instrument.clear()

    const orbit1 = instrument.addChild(new Orbit({ speed: 1/8, steps: 8, snap: true}))
    orbit1.addChild(new NotePlanet({ octave: 1, note: 'C', phase: 0}))
    const planet = orbit1.addChild(new NotePlanet({ octave: 4, note: 'C', phase: 0.25}))

    const orbit2 = instrument.addChild(new Orbit({ speed: 1/2, steps: 16, snap: false}))
    orbit2.addChild(new NotePlanet({ octave: 2, note: 'C', phase: 0}))

    const orbit3 = instrument.addChild(new Orbit({ speed: 1, steps: 32, snap: true}))
    orbit3.addChild(new NotePlanet({ octave: 3, note: 'C', phase: 0}))
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
